<template lang="pug">
  div
    div.f5
      div.mb2
        span.bg-black-50.w2.h2.pa3.br2.f1.flex.items-center.justify-center
          emoji.f2.w3.h3.br2.flex.items-center.justify-center.b--black-30.pulsing-slow(:x="selected") {{ selected.emoji }}

      div.mv3
        div.flex.mv1
          span.w3 Name
          span.mh2 {{ selected.name }}
        div.flex.mv1
          span.w3 Guild
          span.mh2.o-10 None
        div.flex.mv1
          span.w3 Level
          span.mh2 {{ selected.level || 1 }}

    div.mv3.f6
      div.flex.flex-row
        div
          div.flex.items-center.mv1
            span.bg-black-50.br1.mr2.pa2.grayscale
              emoji.o-10.f3 👤
            span.o-20.mh2 Empty
          div.flex.flex-row.items-center.mv1
            span.bg-black-50.br1.mr2.pa2.grayscale
              emoji.o-10.f3 🖐
            span.o-20.mh2 Empty
          div.flex.flex-row.items-center.mv1
            span.bg-black-50.br1.mr2.pa2.grayscale
              emoji.o-10.f3 🧣
            span.o-20.mh2 Empty

    div.flex.flex-column.f7.bg-black-50.pa2.br2
      div.flex.items-center.mb1
      //-   div.pa2.br1
      //-     emoji 📜
      //-   span.mr1 1x
      //-   span RFC7530
      //- div.flex.items-center.mb1
      //-   div.pa2.br1
      //-     emoji 🕯
      //-   span.mr1 3x
      //-   span Candle
      //- div.flex.items-center.mb1
      //-   div.pa2.br1
      //-     emoji 🗝
      //-   span.mr1 1x
      //-   span Old key
      div.flex.items-center.mb1
        div.pa2.br1
          emoji &nbsp;&nbsp;&nbsp;&nbsp;
        span.mh2 
        span 
      div.flex.items-center.mb1
        div.pa2.br1
          emoji &nbsp;&nbsp;&nbsp;&nbsp;
        span.mh2 
        span 
      div.flex.items-center.mb1
        div.pa2.br1
          emoji &nbsp;&nbsp;&nbsp;&nbsp;
        span.mh2 
        span 
      div.flex.items-center.mb1
        div.pa2.br1
          emoji &nbsp;&nbsp;&nbsp;&nbsp;
        span.mh2 
        span 
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      selected: {
        emoji: '👻',
        name: 'John',
        level: 1
      }
    }
  }
})
</script>