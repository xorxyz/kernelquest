<template>
  <div
    id="music_player"
    @click="togglePause">
    {{ label }}
    <audio
      ref="audio"
      preload="auto"
      loop
      hidden
      :muted="muted"
      volume="0.1"
      id="audio_player"
      class="hidden">
      <source
        src="music/village.wav"
        type="audio/wav">
      <source
        src="music/title_screen.wav"
        type="audio/wav">
      <source
        src="music/dungeon.wav"
        type="audio/wav">
    </audio>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const MUTED = '🔊 Unmute';
const NOT_MUTED = '🔇 Mute';

export default defineComponent({
  data() {
    return {
      muted: true,
      label: MUTED,
    };
  },
  methods: {
    togglePause() {
      this.$data.label = this.$data.muted ? NOT_MUTED : MUTED;
      this.$data.muted = !this.$data.muted;
      if (!this.$data.muted) this.play();
    },
    reset() {
      (this.$refs.audio as HTMLAudioElement).fastSeek(0);
      (this.$refs.audio as HTMLAudioElement).pause();
    },
    play() {
      (this.$refs.audio as HTMLAudioElement).play();
    },
    pause() {
      (this.$refs.audio as HTMLAudioElement).pause();
    },
  },
});
</script>
