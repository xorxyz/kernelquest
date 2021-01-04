<template lang="pug">
.flex.bg-light-eggplant.pv2.br2.shadow-2.flex-column.items-start.h-100

  div.flex.w-100
    emoji.mh2.w2.h2.flex.items-center.justify-center.f6 🌓
    div.flex.items-center.mh1.f6 2038, First quarter moon
  div.flex.w-100
    emoji.mh2.w2.h2.flex.items-center.justify-center.f6 📍
    div.flex.items-center.mh1.f6 Intro area
  div.flex.w-100
    emoji.mh2.w2.h2.flex.items-center.justify-center.f6 💰
    div.flex.items-center.mh1.f6 0 GP

  div.flex.w-100
    emoji.mh2.w2.h2.flex.items-center.justify-center.f6 🩸 
    div.mh2.w-100.items-center.flex
      div.bg-black-70.w-100.h1.flex.br2
        div.bg-red.br2.flex.items-center.justify-center.bw2.b--purple.pa1(
          :class="getClassMap(hero.hp)")
          div.f7.black(v-if="hero.hp") {{ hero.hp * 10 }}%

  div.flex.w-100
    emoji.mh2.w2.h2.flex.items-center.justify-center.f6 ✨
    div.mh2.w-100.items-center.flex
      div.bg-black-70.w-100.h1.flex.br2
        div.bg-vlight-eggplant.br2.flex.items-center.justify-center.bw2.b--eggplant.pa1(
          :class="getClassMap(hero.sp)")
          div.f7.black(v-if="hero.sp") {{ hero.mp * 10 }}%


  div.mv1.flex.w-100
    emoji.mh2.w2.h2.flex.items-center.justify-center.f6 👟 
    div.mh2.w-100.items-center.flex
      div.bg-black-70.w-100.h1.flex.br2
        div.bg-green.br2.flex.items-center.justify-center.bw2.b--dark-green.pa1(
          :class="getClassMap(hero.sp)")
          div.f7.black(v-if="hero.sp") {{ hero.sp * 10 }}%


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
        sp: 0, // stamina points 0-10
        mp: 0 // mp points 0-10
      }
    }
  }
})
</script>