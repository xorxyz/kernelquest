<template lang="pug">
.map.shadow-2.h-100.bg-black-60.br2.flex.flex-column.items-center.justify-center
  .flex
    .black-60.bg-parchment.mv3.ph3.pv2.shadow-2.br1
      span 📍 
      span.mh2 Valley of the King
  .flex.w-100.h-100.flex.items-center.justify-center
    div.relative
      div.absolute.top0.pa4.z-3.clickthrough.ba
        div.flex.flex-column
          .h2.flex(v-for="row in rows")
            .w2.flex.b--black-10(v-for="cell in row" 
              :class="typeof cell === 'number' ? 'clickthrough' : ''")
              div.w2.h2.pa1
                .bg-black.br2.shadow-1.w-100.h-100.pa05.clickable.wiggle(v-if="typeof cell !== 'number'")
                  emoji.f4 {{ cell }}
      div.flex.bg-white-90.flex-column.pa4.shadow-2.br1.ba.b--black-20
        div.br1.shadow-2.pa0
          div
            div.flex.w-100.justify-around(v-for="row in tiles")
              div.w3.h3.pa0.flex.justify-center.items-center.relative.ba.b--black-10(
                v-for="cell in row"
                :class="{ 'bg-red': cell.b === 'red', 'bg-blue': cell.b === 'blue', 'bg-green': cell.b === 'green', 'bg-beige': cell.b === 'beige', 'hover-b--black-30': cell.e }"
              )
                .absolute.w-100.h-100
                  emoji.relative.f1.ma1 {{cell.e}}

</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      rows: [[1,2,3,'🧙',5,6,7,8],[1,2,3,4,'🧙🏽‍♂️',6,7,8],[1,2,3,4,5,6,7,8],[1,2,'🧙🏽',4,5,0,7,8],[1,2,3,4,5,'🧙🏼',7,8],[1,2,3,4,5,6,7,8],[1,'🧙🏿‍♀️',3,4,5,6,7,8],[1,2,3,4,5,'☠️',7,8]],
      tiles: [
  [
    {b: 'green',e:'🌳'},
    {b: 'beige',e:'🏔'},
    {b:'green', e:''},
    {b: 'green', e:'🏰', p: { b: 1, n: 'spider', e: '🕷' }}
  ],
  [
    {b: 'green',e:'🍄', p: {l: 1, n: '', e: '💰'}},
    {b: 'green',e:''},
    {b: 'green',e:''},
    {b: 'green',e:'🌱', p: {n: 'anonymous', e: '🕵️'}}
  ],
  [
    {b: 'beige', e:'🏘️'},
    {b: 'beige',e:''},
    {b: 'green',e:'🌿'},
    {b: 'green',e:'🌼', p: {n: 'Eve', e: '🕵️'}}
  ],
  [
    {b: 'green',e:'', p: {n: 'bob', e: '🕵️'}},
    {b: 'beige',e:'🏘', p: {n: 'Alice_88', e: '🕵️'}},
    {b: 'green',e:'🌳'},
    {b: 'blue',e:'🌊'}
  ]
]
    };
  }
});
</script>