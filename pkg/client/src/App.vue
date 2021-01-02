<template lang="pug">
  .flex.flex-column.w-100.h-100.items-center
    .container.w-100.h-100.flex.flex-column.h-100.pa2.justify-center.items-center
      main.w-100.h-100.b--blue.flex.flex-column
        #top-part.w-100.h-100.flex.flex-row
          .mr1.w-70.flex.flex-column.relative
            div
              GameMap(state="this" @select="handleSelect")
            div.pv2
              div.bg-black.br2.pv2
                Terminal
          .ml1.w-30.h-100.flex.flex-column
            div.h-100
              Sidebar.h-100(:selected="selected")
            div.mt2
              Stats(state="this")

</template>

<style scoped>
</style>

<script lang="ts">
import Vue from 'vue';
import Terminal from './components/Terminal.vue';
import GameMap from './views/GameMap.vue';
import Sidebar from './views/Sidebar.vue';  
import Stats from './views/Stats.vue';
import Sockets from './components/Sockets.vue'
// import ws from './sockets';

export default Vue.extend({
  components: {
    Terminal,
    GameMap,
    Sidebar,
    Stats,
    Sockets
  },
  mounted () {
    // const { boxEl } = this.$refs

    // boxEl.addEventListener('click', this.focusInput)

    // ws.bus.$on('message', e => {
    //   if (e.type && e.type === 'event:log' && e.payload && e.payload.message) {
    //     this.messages.push(e.payload.message)
    //   }
    //   if (e.type && e.type === 'event:say' && e.payload && e.payload.message) {
    //     this.messages.push(e.payload.userId + ': ' + e.payload.message)
    //   }
    // })
  },
  methods: {
    handleSelect (entity) {
      this.selected = entity
    },
  },
  data() {
    return {
      input: '',
      selected: { type: 'player' },
      messages: [
        'older at the top',
        'text goes here',
        'hi',
        'this is more recent',
        'older at the top',
        'text goes here',
        'hi',
        'this is more recent',
        'older at the top',
        'text goes here',
        'hi',
        'this is more recent'
      ],
    };
  }
});
</script>