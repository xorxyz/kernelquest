<template>
  <div
    id="music_player"
    @click="togglePause">
    {{ label }}
    <audio
      ref="audio"
      preload="auto"
      autoplay
      loop
      hidden
      :muted="muted"
      volume="0.3"
      id="audio_player"
      class="hidden"
      src="https://www.kernel.quest/music/village.wav">
      <source
        src="https://www.kernel.quest/music/dungeon.wav"
        type="audio/wav">
      <source
        src="https://www.kernel.quest/music/village.wav"
        type="audio/wav">
    </audio>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const MUTED = '🔇 Muted  ';
const NOT_MUTED = '🔊 Unmuted';

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
    },
    reset() {
      this.$refs.audio.fastSeek(0);
      this.$refs.audio.play();
    },
    play() {
      this.$refs.audio.play();
    },
    pause() {
      this.$refs.audio.pause();
    },
  },
});
</script>
