<template lang="pug">
  .flex.flex-column.w-100.h-100.items-center
    .container.w-100.h-100.flex.flex-column.h-100.pa2.justify-center.items-center
      main.w-100.h-100.b--blue.flex.flex-column
        #top-part.w-100.h-100.flex.flex-row
          .mr1.w-70.flex.flex-column.relative
            GameMap(state="this" @select="handleSelect")
            div.absolute.bottom-0.w-100.pa2.white-70.code.f5.flex.justify-end.flex-column.overflow-y-scroll(ref="boxEl" style="height: 12rem;")
              div.mb1
                div(v-for="message in messages") {{ message }}
              form.w-100(@submit.prevent="handleMessage")
                input.code.w-100.bg-black-10.bw0.white-90.pv1.outline-0(ref="inputEl" :value="input")
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
import GameMap from './views/GameMap.vue';
import Sidebar from './views/Sidebar.vue';  
import Stats from './views/Stats.vue';
import ws from './sockets';

export default Vue.extend({
  components: {
    GameMap,
    Sidebar,
    Stats
  },
  mounted () {
    const { boxEl } = this.$refs

    boxEl.addEventListener('click', this.focusInput)

    ws.bus.$on('message', e => {
      console.log('message in app!', e)
      if (e.message) {
        this.messages.push(e.message)
      }
    })
  },
  methods: {
    focusInput () {
      const { inputEl } = this.$refs

      inputEl.focus()
    },
    handleSelect (entity) {
      this.selected = entity
    },
    handleMessage (e) {
      const el = this.$refs.inputEl

      el.blur()

      const txt: string = el.value 
      
      this.messages.push(txt)

      if (txt.startsWith('/')) {
        const tokens = txt.slice(1).split(' ')
        const cmd = tokens[0]
        const args = tokens.slice(1)
        ws.send(cmd, ...args)
      } else {
        ws.say(txt)
      }
    }
  },
  data() {
    return {
      input: '',
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
      selected: { type: 'player' }
    };
  }
});
</script>