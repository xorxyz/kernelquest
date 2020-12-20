<template lang="pug">
  .flex.flex-column.w-100.items-center
    .container.flex.flex-column.h-100.ph4.w-100.pa4.justify-center.items-center
      main.b--blue.flex.flex-column.w-100
        #top-part.flex.flex-row.w-100
          .mr1.w-70.flex.flex-column
            GameMap
          .ml1.w-30.flex.flex-column
            Sidebar
        #bottom-part.mv2.flex.flex-row.w-100
          .mr1.w-70
            Chat
          .ml1.w-30
            Stats

</template>

<style scoped>
</style>

<script lang="ts">
import Vue from 'vue';
import GameMap from './GameMap.vue';
import Sidebar from './Sidebar.vue';
import Chat from './Chat.vue';
import Stats from './Stats.vue';

export default Vue.extend({
  components: {
    GameMap,
    Sidebar,
    Chat,
    Stats
  },
  data() {
    return {
    };
  }
});
</script>