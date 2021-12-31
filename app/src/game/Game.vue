<template>
  <div class="mv4 ba bw1 br2 bg-black">
    <div id="terminal-container" class="container bw1 b--white">
      <div ref="terminal" autofocus tabindex="0"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import { Terminal } from "xterm";
  import * as FitAddon from "xterm-addon-fit";
  import { Hero, Wizard } from "../../../game/engine/agents";
  import { TTY } from "../../../game/ui/tty";
  import { Unicode14Addon } from "../../vendor/unicode14";

  export default defineComponent({
    mounted () {
      const fitAddon = new FitAddon.FitAddon();
      const unicode14Addon = new Unicode14Addon();

      this.$data.xterm.loadAddon(fitAddon);
      this.$data.xterm.loadAddon(unicode14Addon);
      this.$data.xterm.unicode.activeVersion = '14';
      this.$data.xterm.open(this.$refs.terminal as HTMLDivElement);
      
      this.xterm.focus();

      const player = new Hero(new Wizard());

      player.room = this.$engine.world.rooms[0];

      new TTY({
        player,
        write: (str) => {
          this.xterm.write(str);
        }
      });
    },
    data() {
      return {
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
        })
      };
    },
  });
</script>
