<template lang="pug">
  .absolute.w-100.h-100.ba.b--black-10(@click="$emit('select', tile)" :class="getClasses(tile)") 
    emoji.relative.f1.ma1(:class="{'squeazing-slow': tile.type === 'place' }") 
    |{{ tile.emoji }}
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    tile: Object
  },
  methods: {
    getClasses (tile) {
      return { 
        'bg-stone': tile.bg === 'stone',
        'bg-ice': tile.bg === 'ice',
        'bg-forest': tile.bg === 'forest',
        'bg-green': ['green'].includes(tile.bg),
        'bg-red': tile.bg === 'red', 
        'bg-blue': tile.bg === 'blue', 
        'bg-beige': tile.bg === 'beige', 
        'bg-grass': tile.bg === 'grass', 
        'hover-b--black-30': tile.emoji, 
        'bg-place': tile.bg === 'place'
      }
    },
  }
})
</script>