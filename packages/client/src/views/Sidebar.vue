<template lang="pug">
  div.sidebar.flex.flex-column.ma0.bg-light-eggplant.pa3.br2.shadow-2
    Player(v-if="selected && (selected.type === 'player' || selected.type === 'npc')" :selected="selected")
    Place(v-if="selected && selected.type === 'place'" :selected="selected")

</template>

<script lang="ts">
import Vue from 'vue';
import Player from './Player.vue';
import Place from './Place.vue';

export default Vue.extend({
  components: {
    Place,
    Player
  },
  props: {
    selected: Object
  },
  data () {
    return {
      
    }
  }
})
</script>