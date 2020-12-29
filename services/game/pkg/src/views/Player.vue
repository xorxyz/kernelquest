<template lang="pug">
  div
    div.f4
      div.mb2
        span.bg-black-50.w3.h3.pa3.br2.f1.flex.items-center.justify-center
          emoji.w2.h2.pa1.br2.f3.flex.items-center.justify-center.b--black-30.pulsing-slow(:x="selected") {{ selected.emoji }}

      div.mv4
        div.flex.mv1
          span.w3 Name
          span.mh2 {{ selected.name }}
        div.flex.mv1
          span.w3 Guild
          span.mh2.o-10 None
        div.flex.mv1
          span.w3 Level
          span.mh2 {{ selected.level || 1 }}

    div.mv4.f4
      div.flex.flex-row.items-center.mv2
        span.bg-black-50.br1.mr2.pa2.grayscale
          emoji.o-10 👤
        span.o-20.mh2 Empty
      div.flex.flex-row.items-center.mv2
        span.bg-black-50.br1.mr2.pa2.grayscale
          emoji.o-10 🖐
        span.o-20.mh2 Empty
      div.flex.flex-row.items-center.mv2
        span.bg-black-50.br1.mr2.pa2.grayscale
          emoji.o-10 🧣
        span.o-20.mh2 Empty

    br

    //- div
    //-   div.mv2
    //-     emoji.bg-black-50.br1.pa1 📜
    //-     span.mh2 1x
    //-     span RFC7530
    //-   div.mv3
    //-     emoji.bg-black-50.br1.pa1 🕯
    //-     span.mh2 3x
    //-     span Candle
    //-   div.mv3
    //-     emoji.bg-black-50.br1.pa1 🗝
    //-     span.mh2 1x
    //-     span Old key
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    selected: Object
  }
})
</script>