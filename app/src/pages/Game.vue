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
        <span class="button link pv1 ph2 pointer mh1"><AudioPlayer ref="audio" /></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, markRaw } from 'vue';
import { Engine, HIT, STEP, ROTATE, GET, PUT, FAIL, DIE } from 'xor4-game';
import { Terminal } from 'xterm';
import * as FitAddon from 'xterm-addon-fit';
import { VirtualTerminal } from 'xor4-cli';
import { debug } from 'xor4-lib';
import { Unicode14Addon } from '../../vendor/unicode14';

const hit = new Audio(new URL('~/public/hit.wav', import.meta.url).toString());
const step = new Audio(new URL('~/public/step.wav', import.meta.url).toString());
const rotate = new Audio(new URL('~/public/rotate.wav', import.meta.url).toString());
const get = new Audio(new URL('~/public/get.wav', import.meta.url).toString());
const put = new Audio(new URL('~/public/put.wav', import.meta.url).toString());
const fail = new Audio(new URL('~/public/fail.wav', import.meta.url).toString());
const die = new Audio(new URL('~/public/die.wav', import.meta.url).toString());

const engine = markRaw(new Engine({}));
const fitAddon = new FitAddon.FitAddon();
const unicode14Addon = new Unicode14Addon();
const xterm = new Terminal({
  theme: {
    background: '#000000',
    black: '#000000',
    green: '#0CFF24',
    red: '#F92672',
  },
  cols: 72,
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
let started = false;

export default defineComponent({
  mounted() {
    debug('game mounted');
    xterm.open(this.$refs.terminal as HTMLDivElement);
    xterm.focus();
    if (started) return;

    (xterm as Terminal).onKey(({ key }) => {
      if (this.paused) return;
      this.input(key);
    });

    const place = engine.world.places[0];
    const players = place.findPlayers();
    const hero = players[0];

    place.events.on(HIT, (e) => hit.play());
    place.events.on(STEP, (e) => {
      if (e?.agent !== hero) return;
      step.fastSeek(0);
      step.play();
    });

    place.events.on(ROTATE, (e) => {
      if (e?.agent !== hero) return;
      rotate.fastSeek(0);
      rotate.play();
    });

    place.events.on(GET, (e) => {
      get.fastSeek(0);
      get.play();
    });

    place.events.on(PUT, (e) => {
      put.fastSeek(0);
      put.play();
    });

    place.events.on(FAIL, (e) => {
      if (e?.agent !== hero) return;
      fail.fastSeek(0);
      fail.play();
    });

    place.events.on(DIE, (e) => {
      (this.$refs.audio as HTMLAudioElement).pause();
      die.fastSeek(0);
      die.play();
    });

    place.events.on('reset', () => {
      // (this.$refs.audio).reset();
    });

    this.tty?.disconnect();

    this.tty = markRaw(new VirtualTerminal(hero, place, (str) => xterm.write(str)));

    this.play();

    started = true;
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
      // bring the game into focus
      (this.$refs.terminal as HTMLElement).focus();
    },
    pause() {
      // pause the engine and the music
      engine.pause();
      (this.$refs.audio as HTMLAudioElement).pause();
      // store state
      this.paused = true;
    },
    input(key) {
      if (!this.tty) {
        debug('no tty');
        return;
      }

      this.tty.handleInput(Buffer.from(key).toString('hex'));
    },
    reset() {
      // TODO
    },
  },
});
</script>
