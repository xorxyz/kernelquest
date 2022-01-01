<template>
  <div class="">
    <div id="terminal-container" class="container">
      <div ref="terminal" autofocus tabindex="0"></div>
      <button @click="$engine.start">play</button>
      <button @click="$engine.pause">pause</button>
      <button @click="restart">restart</button>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import { Terminal } from "xterm";
  import * as FitAddon from "xterm-addon-fit";
  import { Agent, Hero, Sheep, Wizard } from "../../../game/engine/agents";
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
      
      const room = this.$engine.world.rooms[0];
  
      player.room = room;
      room.agents.add(player);
        
      const tty = new TTY({
        player: player,
        write: (str) => xterm.write(str)
      });
    },
    data(): { xterm: Terminal } {
      return {
        xterm: xterm
      }
    },
    methods: {
      restart () {
        this.$engine.world = new World();

        const sheep = new Agent(new Sheep());
        const room = this.$engine.world.rooms[0];

        sheep.room = room;

        room.agents.add(sheep);

        const trees = [
          [5,0],
          [1,1],
          [3,1],
          [4,1],
          [0,2],
          [1,4],
        ];
      
        trees.forEach(([x,y]) => {
          room.cellAt(Vector.from({ x, y }))
              .items.push(new Tree());
        });
      
        room.cellAt(Vector.from({ x: 4, y: 0 }))
          .items.push(new Book());
      
        room.cellAt(Vector.from({ x: 14, y: 8 }))
          .items.push(new Flag());
      }
    }
  });
</script>
