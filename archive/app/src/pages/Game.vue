<template>
  <div>
    <div
      id="terminal-container"
      class="container flex flex-column items-center">
      <div
        ref="terminal"
        autofocus
        tabindex="0"
        class="mv1 ba" />

      <div class="flex mv2 w-100 justify-center">
        <span
          class="button link pv1 ph2 pointer mh1"
          v-show="paused"
          @click="play">▶️ Play</span>
        <span
          class="button link pv1 ph2 pointer mh1"
          v-show="!paused"
          @click="pause">⏸️ Pause</span>
        <span
          class="button link pv1 ph2 pointer mh1"
          @click="reset">↩️ Reset</span>
        <span class="button link pv1 ph2 pointer mh1">
          <AudioPlayer ref="audio" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue';
import { Engine, Agent, Area, World } from 'xor4-game';
import words from 'xor4-game/lib/words';
import { Terminal } from 'xterm';
import * as FitAddon from 'xterm-addon-fit';
import { SCREEN_WIDTH, VirtualTerminal } from 'xor4-cli';
import { debug, Vector } from 'xor4-lib';
import { Unicode14Addon } from 'xor4-cli/vendor/unicode14';
import { King } from 'xor4-game/lib/agents';
import AudioPlayer from '../components/AudioPlayer.vue';

const hero = new Agent(new King(), words);
const area = new Area(0, 0);
const engine = markRaw(new Engine({
  world: new World([area]),
}));

area.agents.add(hero);
area.cellAt(new Vector(0, 0))?.put(hero);

const fitAddon = new FitAddon.FitAddon();
const unicode14Addon = new Unicode14Addon();
const xterm = new Terminal({
  theme: {
    background: '#000000',
    black: '#000000',
    green: '#0CFF24',
    red: '#F92672',
  },
  cols: SCREEN_WIDTH,
  rows: 25,
  fontSize: 21,
  cursorBlink: true,
  cursorWidth: 12,
  customGlyphs: true,
  fontFamily: 'ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace',
});
xterm.loadAddon(fitAddon);
xterm.loadAddon(unicode14Addon);
xterm.unicode.activeVersion = '14';

export default defineComponent({
  beforeUnmount() {
    console.log('beforeUnmount');
  },
  mounted() {
    debug('game mounted');
    // this.pause();
    const { cmd } = this.$router.currentRoute.value.query;
    if (cmd === 'load') {
      console.log('loading level');
      // engine.load('1');
    }

    engine.load([]);

    xterm.open(this.$refs.terminal as HTMLDivElement);
    xterm.focus();
    // if (started) return;

    (xterm as Terminal).onKey(({ key }) => {
      if (this.paused) return;
      this.input(key);
    });

    this.tty?.disconnect();
    this.tty = markRaw(new VirtualTerminal(hero, engine.events, (str) => xterm.write(str)));

    this.play();

    global.engine = engine;

    // started = true;
  },
  data(): { tty: VirtualTerminal | undefined, paused: boolean } {
    return {
      tty: undefined,
      paused: false,
    };
  },
  methods: {
    play() {
      // start the engine and the music
      engine.start();
      this.paused = false;
      (this.$refs.audio as InstanceType<typeof AudioPlayer>).play();
      // bring the game into focus
      (this.$refs.terminal as HTMLElement).focus();
    },
    pause() {
      // pause the engine and the music
      engine.pause();
      (this.$refs.audio as InstanceType<typeof AudioPlayer>).pause();
      // store state
      this.paused = true;
    },
    input(key) {
      if (!this.tty) {
        debug('no tty');
        return;
      }

      console.log('input:', key);

      this.tty.handleInput(Buffer.from(key).toString('hex'));
    },
    reset() {
      // TODO
    },
  },
});
</script>
