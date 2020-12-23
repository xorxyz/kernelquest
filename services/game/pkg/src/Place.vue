<template lang="pug">
  div
    div.f4
      div.mb2
        span.bg-black-50.w3.h3.pa3.br2.f1.flex.items-center.justify-center
          emoji.squeazing-slow.f1 {{ selected.e }}

      div.mv4
        div.flex.mv1
          span.w3 Place
          span.mh2 {{ selected.name }}
        div.flex.mv1
          span.w3 Level
          span.mh2 {{ selected.level }}
        div.flex.mv1
          span.w3 Flags
          span.mh2 {{ selected.flags }}

    div.mv4.f4
      //- div.flex.flex-row.items-center.mv2
      //-   span.bg-black-50.br1.mr2.pa2.grayscale
      //-     emoji.o-10 ⚡
      //-   span.o-20.mh2 Power
      //- div.flex.flex-row.items-center.mv2
      //-   span.bg-black-50.br1.mr2.pa2.grayscale
      //-     emoji.o-10 🔢
      //-   span.o-20.mh2 Compute
      //- div.flex.flex-row.items-center.mv2
      //-   span.bg-black-50.br1.mr2.pa2.grayscale
      //-     emoji.o-10 🗃️
      //-   span.o-20.mh2 Storage
      //- div.flex.flex-row.items-center.mv2
      //-   span.bg-black-50.br1.mr2.pa2.grayscale
      //-     emoji.o-10 🌐
      //-   span.o-20.mh2 Network

      div.mt4 Connections

      div.mv3.flex.items-center.justify-start
        div.mr2.mv2.pv1
          span.bg-black-90.br1.f3.br2.ph1
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
