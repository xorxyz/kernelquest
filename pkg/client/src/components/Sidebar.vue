<template lang="pug">
  div.flex.flex-column.mw5
    Player.mb2
    Stats
</template>

<script lang="ts">
import Vue from 'vue';
import Player from './Player.vue';
import Stats from './Stats.vue';

export default Vue.extend({
  components: {
    Player,
    Stats
  }
})
</script>