<template lang="pug">
  div
    div.f6
      div.mb2
        span.bg-black-50.w3.h3.pa1.br2.f1.flex.items-center.justify-center
          emoji.squeazing-slow.f2 {{ selected.e }}

      div
        span.mr2.w3 Place
        span.mh2  {{ selected.name }}
      div.mv1
        span.mr2.w3 Level
        span.mh2 {{ selected.level }}
      div.mv1
        span.mr2.w3 Flags
        span.mh2 {{ selected.flags }}

      div.mv4
        div.mv2.pv1
          span.bg-black-50.br1.f4.pa1.ph2
            emoji.o-10.grayscale ⚡
          span.mh2.o-20 Power
        div.mv2.pv1
          span.bg-black-50.br1.f4.pa1.ph2
            emoji.o-10.grayscale 🔢
          span.mh2.o-20 Compute
        div.mv2.pv1
          span.bg-black-50.br1.f4.pa1.ph2
            emoji.o-20.grayscale 🗃️
          span.mh2.o-20 Storage
        div.mv2.pv1
          span.bg-black-50.br1.f4.pa1.ph2
            emoji.o-20.grayscale 🌐
          span.mh2.o-20 Network 

      div Connections

      div.mt1.flex.items-center.justify-start
        div.mr2.mv2.pv1
          span.bg-yellow.br1.f3.br2.ph1
            emoji 🕵️
        //- div.mv2.pv1
        //-   span.bg-black-50.br1.f3.ph1
        //-     emoji &nbsp;&nbsp;&nbsp;&nbsp;
        //-   span.mh2.o-20 
        //- div.mv2.pv1
        //-   span.bg-black-50.br1.f3.ph1
        //-     emoji &nbsp;&nbsp;&nbsp;&nbsp;
        //-   span.mh2.o-20 

</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    selected: Object
  }
})
</script>
