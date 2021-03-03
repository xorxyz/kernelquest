<template lang="pug">
div.flex.flex-column.bg-light-eggplant.pv2.h-100.ph2.f6
  div.flex.w-100
    emoji.mh2.w2.h2.flex.items-center.justify-center 🌓
    div.flex.items-center.mh1 2038, First quarter moon
  div.flex.w-100
    emoji.mh2.w2.h2.flex.items-center.justify-center 📍
    div.flex.items-center.mh1 Intro area
  div.flex.w-100
    emoji.mh2.w2.h2.flex.items-center.justify-center.f6 💰
    div.flex.items-center.mh1 0 GP
  div.flex.w-100
    emoji.mh2.w2.h2.flex.items-center.justify-center 🩸 
    div.mh2.w-100.items-center.flex
      div.bg-black-70.w-100.flex.br2
        div.h1.bg-red.br2.flex.items-center.justify-center.bw2.b--purple.pa1(
          :class="getClassMap(hero.hp)")
          div.f7.black-90() {{ hero.hp * 10 }}%
  div.flex.w-100
    emoji.mh2.w2.h2.flex.items-center.justify-center ✨
    div.mh2.w-100.items-center.flex
      div.bg-black-70.w-100.flex.br2
        div.h1.bg-vlight-eggplant.br2.flex.items-center.justify-center.bw2.b--eggplant.pa1(
          :class="getClassMap(hero.mp)")
          div.f7.white() {{ hero.mp * 10 }}%
  div.flex.w-100
    emoji.mh2.w2.h2.flex.items-center.justify-center 👟 
    div.mh2.w-100.items-center.flex
      div.bg-black-70.w-100.flex.br2
        div.h1.bg-green.br2.flex.items-center.justify-center.bw2.b--dark-green.pa1(
          :class="getClassMap(hero.sp)")
          div.f7.black-90() {{ hero.sp * 10 }}%


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
        hp: 0, // hit points 0-10
        mp: 0, // mp points 0-10
        sp: 0, // stamina points 0-10
      }
    }
  }
})
</script>