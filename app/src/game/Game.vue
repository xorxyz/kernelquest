<template>
  <div class="">
    <div id="terminal-container" class="container">
      <div class="flex mv2">
        <span class="button link pv1 ph2 pointer mh1" v-show="paused" @click="play">▶️ Play</span>
        <span class="button link pv1 ph2 pointer mh1" v-show="!paused" @click="pause">⏸️ Pause</span>
        <span class="button link pv1 ph2 pointer mh1" @click="reset">↩️ Reset</span>
      </div>

      <div ref="terminal" autofocus tabindex="0" class="mv1"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, markRaw } from "vue";
  import { Engine } from "xor4-game/engine";
  import { Room } from "xor4-game/engine/room";
  import { Sheep, Wizard } from "xor4-game/lib/agents";
  import { Terminal } from "xterm";
  import * as FitAddon from "xterm-addon-fit";
  import { Agent, Hero } from "../../../game/engine/agents";
  import { Book, Flag, Tree } from "../../../game/engine/things";
  import { World } from "../../../game/engine/world";
  import { TTY } from "../../../game/ui/tty";
  import { Vector } from "../../../lib/math";
  import { Unicode14Addon } from "../../vendor/unicode14";

  const engine = markRaw(new Engine({
    world: new World(),
  }))

  export default defineComponent({
    created () {      
      const fitAddon = new FitAddon.FitAddon();
      const unicode14Addon = new Unicode14Addon();

      this.xterm.loadAddon(fitAddon);
      this.xterm.loadAddon(unicode14Addon);
      this.xterm.unicode.activeVersion = '14';
    },
    mounted () {
      console.log('game mounted')
      this.xterm.open(this.$refs.terminal as HTMLDivElement);
      this.xterm.focus();

      this.reset();
    },
    data(): { tty: TTY | undefined, xterm: Terminal, paused: boolean } {
      return {
        tty: undefined,
        xterm: new Terminal({
          theme: {
            background: '#000000',
            black: '#000000',
            green: '#0CFF24',
            red: '#F92672',
            blue: '#66D9EF'
          },
          cols: 72,
          rows: 25,
          fontSize: 21,
          cursorBlink: true,
          cursorWidth: 12,
          customGlyphs: true,
          fontFamily: 'ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace'
        }),
        paused: true
      }
    },
    methods: {
      play () {
        engine.start();
        this.paused = false;
      },
      pause () {
        engine.pause();
        this.paused = true;
      },
      reset () {
        const player = markRaw(new Hero(new Wizard()));
        const room = engine.world.rooms[0] as Room;
        // const sheep = new Agent(new Sheep());
        const trees = [[5,0], [1,1], [3,1], [4,1], [0,2], [1,4]];
        const flag = markRaw(new Flag());

        engine.world.clear();

        room.add(player);
        // room.add(sheep, new Vector(6, 9));

        trees.forEach(([x,y]) => room.cellAt(Vector.from({ x, y })).put(markRaw(new Tree())));
        room.cellAt(Vector.from({ x: 4, y: 0 })).put(markRaw(new Book()));
        room.cellAt(Vector.from({ x: 14, y: 8 })).put(flag);

        this.tty?.disconnect();

        this.tty = markRaw(new TTY({
          room,
          player,
          write: (str) => this.xterm.write(str)
        }));

        (this.xterm as Terminal).onKey(({ key }) => {
          if (this.paused) return;
          this.tty.handleInput(Buffer.from(key).toString('hex'));
        });

        this.play();
      },
    }
  });
</script>
