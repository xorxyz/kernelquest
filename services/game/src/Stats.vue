<template lang="pug">
.stats.flex.bg-light-eggplant.ph2.pv3.br2.shadow-2.flex-column.items-start.h-100
  div.mv1
    emoji 🌓 
    span.mh2 12th 1/4 moon

  div.mv1.flex.w-100
    emoji 🩸 
    div.mh2.w-100.items-center.flex
      div.bg-black-70.w-100.h1.flex.br2
        div.bg-red.br2.flex.items-center.justify-center(
          :class="getClassMap(hp)")
          div.f7.black {{ hp * 10 }}%
  div.mv1.flex.w-100
    emoji 👟 
    div.mh2.w-100.items-center.flex
      div.bg-black-70.w-100.h1.flex.br2
        div.bg-green.h1.br2.flex.items-center.justify-center(
          :class="getClassMap(sp)")
          div.f7.black {{ sp * 10 }}%
  div.mv1 
    emoji 💰 
    span.mh2 23

</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    getClassMap (value) {
      const classMap = {}

      Array(11).fill(0).forEach((n, i) => {
        const key = `w-${i||''}0`
        classMap[key] = value === i
      })

      console.log(classMap)

      return classMap
    }
  },
  data () {
    return {
      hp: 3,
      sp: 8
    }
  }
})
</script>