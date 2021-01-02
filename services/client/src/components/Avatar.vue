<template lang="pug">
  div.w2.h2.pa1.ba.b--black-10.hover-bg-black-50.bw05
    .w-100.h-100.clickable.br2(
      @click="$emit('select', e)"
      :class="{ 'bg-gray pulsing-fast': e.type === 'critter', 'bg-yellow pulsing-slow': e.type === 'npc', 'bg-black-80 pulsing-slow': e.type === 'player', 'bg-black-50 glowing': e.type === 'item', 'bg-hot-pink squeazing': e.type === 'enemy', 'bg-purple glowing': e.type === 'corpse' }"
    )
      div.br2.tooltip.relative.dib.pa05(v-if="e.emoji")
        emoji.f4
          |{{ e.emoji }}
        .tooltip-text.bg-white-80.black.br1.pa1.f7.top-0.ph2(v-if="e.name")
          | {{ e.name }}
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    e: Object
  }  
})
</script>