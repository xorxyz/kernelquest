<template lang="pug">
.flex.bg-light-eggplant.ph2.pv3.br2.shadow-2.flex-column.items-start.h-100
  div.mv1.flex.w-100
    emoji.f3.mh2 🩸 
    div.mh2.w-100.items-center.flex
      div.bg-black-70.w-100.h2.flex.br2
        div.bg-red.br2.flex.items-center.justify-center.bb.bw2.b--purple(
          :class="getClassMap(hero.hp)")
          div.f7.black {{ hero.hp * 10 }}%

  div.mv1.flex.w-100
    emoji.f3.mh2 ✨
    div.mh2.w-100.items-center.flex
      div.bg-black-70.w-100.h2.flex.br2
        div.bg-vlight-eggplant.br2.flex.items-center.justify-center.bb.bw2.b--eggplant(
          :class="getClassMap(hero.sp)")
          div.f7.black {{ hero.sp * 10 }}%


  div.mv1.flex.w-100
    emoji.f3.mh2 👟 
    div.mh2.w-100.items-center.flex
      div.bg-black-70.w-100.h2.flex.br2
        div.bg-green.br2.flex.items-center.justify-center.bb.bw2.b--dark-green(
          :class="getClassMap(hero.sp)")
          div.f7.black {{ hero.sp * 10 }}%

  div.mv1
    emoji.f3.mh2 💰 
    span.f3 23

</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  methods: {
    getClassMap (value) {
      const classMap = {};

      Array(11).fill(0).forEach((n, i) => {
        const key = `w-${i||''}0`
        classMap[key] = value === i
      });

      return classMap
    }
  },
  data () {
    return {
      hero: {
        hp: 10, // hit points 0-10
        sp: 10 // stamina points 0-10
      }
    }
  }
})
</script>