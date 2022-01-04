<template>
  <div class="">
    <div id="terminal-container" class="container">
      <button v-show="paused" @click="play">play</button>
      <button v-show="!paused" @click="pause">pause</button>

      paused: {{ paused }}
      <button @click="restart">restart</button>
      <div ref="terminal" autofocus tabindex="0"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
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

  const player = new Hero(new Wizard());
  const xterm = new Terminal({
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
  });

  let timer
  let tty: TTY

  export default defineComponent({
    mounted () {
      console.log('game mounted')
      const fitAddon = new FitAddon.FitAddon();
      const unicode14Addon = new Unicode14Addon();

      this.$data.xterm.loadAddon(fitAddon);
      this.$data.xterm.loadAddon(unicode14Addon);
      this.$data.xterm.unicode.activeVersion = '14';
      this.$data.xterm.open(this.$refs.terminal as HTMLDivElement);
      
      this.xterm.focus();

      this.$engine.world = new World();
      
      const room = this.$engine.world.rooms[0] as Room;
  
      room.add(player);

      tty = new TTY({
        room,
        player,
        write: (str) => xterm.write(str)
      });

      const sheep = new Agent(new Sheep());
      const trees = [[5,0], [1,1], [3,1], [4,1], [0,2], [1,4]];

      room.add(sheep, new Vector(6, 9));

      trees.forEach(([x,y]) => room.cellAt(Vector.from({ x, y })).put(new Tree()));
      room.cellAt(Vector.from({ x: 4, y: 0 })).put(new Book());
      const flag = new Flag();
      const flagCell = room.cellAt(Vector.from({ x: 14, y: 8 }));
      flagCell.put(flag);
    },
    data() {
      return {
        xterm: xterm,
        paused: true
      }
    },
    methods: {
      play () {
        this.$engine.start();
        this.paused = false;
      },
      pause () {
        this.$engine.pause();
        this.paused = true;
      }
    }
  });
</script>
