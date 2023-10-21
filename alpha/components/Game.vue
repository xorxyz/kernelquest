<template>
  <div class="mv1">
    <div class="flex items-center justify-center bw1 b--white mv0 pv0">
      <div id="terminal" class="overflow-hidden" :class="{ 'o-0': !init }"></div>
      <button v-if="!init" class="f2 pv2 ph3 ma3 fixed pointer strong bg-white b--none br2 shadow2" @click="onClick">
        Run game
      </button>
    </div>
    <audio id="audio-player" preload="auto" hidden></audio>
    <div class="pv3">
      <button class="pv1 ph3" @click="toggleMute">
        {{ muted ? '🔊 Unmute' : '🔇 Mute' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  async mounted(){
    if (!process.client) return;

    const { Engine } = await import('xor5-game/src');
    const { SystemIO } = await import('../lib/system_io');
    const { Terminal } = await import('../lib/terminal');
    const { AudioPlayer } = await import('../lib/audio_player');

    await import('tachyons/css/tachyons.css');
    await import('xterm/css/xterm.css');
    await import('../index.css');

    try {
      await import(`https://kernelquest-assets.s3.ca-central-1.amazonaws.com/levels/${this.levelId}.js`)
    } catch (e) {
      console.log('Failed to load level data.')
    }

    const systemIO = new SystemIO();
    const terminal = new Terminal('terminal');
    const audioPlayer = new AudioPlayer('audio-player');

    this.engine = new Engine({
      systemIO,
      terminal,
      audioPlayer,
    });
    
    // this.engine.loadLevel()
    this.mute();

    this.handleVisibilityChanges();

  },
  props: {
    levelId: String,
  },
  methods: {
    onClick() {
      if (this.init) return;
      this.init = true;
      this.engine.start();
    },
    toggleMute() {
      this.muted ? this.unmute() : this.mute();
    },
    mute() {
      document.querySelectorAll(".music").forEach((elem) => {
        elem.muted = true;
      });
      this.muted = true;
    },
    unmute() {
      document.querySelectorAll(".music").forEach((elem) => {
        elem.muted = false;
      });
      this.muted = false;
    },
    handleVisibilityChanges() {
      if (!this.init) return;
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
      minimized: false,
      init: false,
      muted: false,
    }
  }
}


</script>
