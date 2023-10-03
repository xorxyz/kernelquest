<template>
  <div>
    <div class="flex items-center justify-center bw1 b--white mv0 pv0">
      <div id="terminal" class="overflow-hidden"></div>
    </div>
    <audio id="audio-player" preload="auto" hidden></audio>
  </div>
</template>

<script lang="ts">

import { Engine } from 'xor5-game/src';
import { SystemIO } from '../lib/system_io';
import { Terminal } from '../lib/terminal';
import { AudioPlayer } from '../lib/audio_player';

import 'tachyons/css/tachyons.css';
import 'xterm/css/xterm.css';
import '../index.css';

export default {
  mounted(){
    const systemIO = new SystemIO();
    const terminal = new Terminal('terminal');
    const audioPlayer = new AudioPlayer('audio-player');

    this.engine = new Engine({
      systemIO,
      terminal,
      audioPlayer,
    });

    if (process.client) {
      this.handleVisibilityChanges();
    } 
  },
  methods: {
    handleVisibilityChanges() {
      // Pause the engine when the window is not visible
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && this.engine.running) {
          this.minimized = true;
          this.engine.pause();
        }

        if (document.visibilityState === 'visible' && this.minimized) {
          this.minimized = false;
          this.engine.start();
        }
      });

      if (!document.hidden) {
        this.engine.start();
      } else {
        this.minimized = true;
      }
    }
  },
  data() {
    return {
      engine: null,
      minimized: false
    }
  }
}


</script>
