<template lang="pug">
  div.sidebar.flex.flex-column.ma0.bg-light-eggplant.pa3.br2.shadow-2
    Player

</template>

<script lang="ts">
import Vue from 'vue';
import Player from './Player.vue';

export default Vue.extend({
  components: {
    Player
  }
})
</script>