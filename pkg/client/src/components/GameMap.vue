<template lang="pug">
.map.shadow-2.h-100.bg-white-80.br2.flex.flex-column
  #game-map.flex.w-100.h-100.flex.justify-start.mb2
    div.flex.justify-center.items-center.w-100
      div.bg-black-10.shadow-2.br2.ba.b--black-20
        div.h2.flex(v-for="(r, i) in rows" :index="i")
          div.w2.flex.b--black-10(v-for="(entity, i) in r" :key="i")
            Cell(:e="entity" @select="select")

</template>

<script lang="ts">
import Vue from 'vue';
import Cell from './Cell.vue';

export default Vue.extend({
  components: {
    Cell,
  },
  props: {
    rows: Array
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