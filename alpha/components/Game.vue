<template>
  <div>
    <div class="flex items-center justify-center bw1 b--white mv0 pv0">
      <div id="terminal" class="overflow-hidden"></div>
    </div>
    <audio id="audio-player" preload="auto" hidden></audio>
  </div>
</template>

<script lang="ts">
export default {
  async mounted(){
    if (!process.client) return;

    console.log(this.levelId);

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

    this.handleVisibilityChanges();
  },
  props: {
    levelId: String
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
