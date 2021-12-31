<template>
  <div class="mv1 flex justify-between items-center w-100">
    <div id="music_player">
      <button id="mute_button" class="mv1" @click="togglePause">
        {{ label }}
      </button>
      <audio 
        preload="auto" autoplay loop hidden muted
        id="audio_player"
        class="ma2"
        src="https://www.kernel.quest/music/village.wav">
        <source src="https://www.kernel.quest/music/dungeon.wav" type="audio/wav">
        <source src="https://www.kernel.quest/music/village.wav" type="audio/wav">
      </audio>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

const MUTED = '🔇 Music is muted';
const NOT_MUTED = '🔊 Music is not muted'

export default defineComponent({
  data () {
    return {
      muted: true,
      label: MUTED
    }
  },
  methods: {
    togglePause () {
      this.$data.label = this.$data.muted ? NOT_MUTED : MUTED
      this.$data.muted = !this.$data.muted;
    }
  }
})
</script>