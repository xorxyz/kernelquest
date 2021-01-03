<template lang="pug">
.map.shadow-2.h-100.bg-black-60.br2.flex.flex-column
  .flex.items-center.justify-center.w-100.f7
    StatusBar
  #game-map.flex.w-100.h-100.flex.justify-center.mt2.mb3
    div.relative
      div.absolute.top0.pa4.z-3.clickthrough.ba
        div.flex.flex-column
          .h2.flex(v-for="(r, i) in rows" :index="i")
            .w2.flex.b--black-10.clickthrough(v-for="(entity, i) in r" :key="i")
              Cell(:e="entity" @select="select")
      div.flex.bg-white-90.flex-column.pa4.shadow-2.br1.ba.b--black-20
        div.br1.shadow-2.pa0
          div.flex.w-100.justify-around(v-for="row in tiles")
            div.w3.h3.pa0.flex.justify-center.items-center.relative(v-for="tile in row")
              Tile(:tile="tile")

</template>

<script lang="ts">
import Vue from 'vue';
import Cell from './Cell.vue';
import Tile from './Tile.vue';
import StatusBar from './StatusBar.vue';

export default Vue.extend({
  components: {
    StatusBar,
    Cell,
    Tile
  },
  props: {
    rows: Array,
    tiles: Array
  },
  methods: {
    select (entity) {
      if (!entity.type) return false
      if (!['player', 'place', 'npc'].includes(entity.type)) return false
      this.$emit('select', entity)
    },
  }
});

</script>