<template lang="pug">
  .flex.flex-column.w-100.h-100.items-center
    .container.w-100.h-100.flex.flex-column.h-100.pa2.justify-center.items-center
      main.w-100.h-100.b--blue.flex.flex-column.justify-center.items-center
        .w-100.h-100.flex.flex-row.justify-center
          .mr1.h-100.flex.flex-column.items-end
            div.h-100
              Sidebar.h-100
          .ml1.flex.flex-column
            div.mb1
              Terminal(@line="handleLine")
            div.h-100.flex.flex-column.mt1
              GameMap(:rows="rows")
</template>

<script lang="ts">
import Vue from 'vue';

import Terminal from './components/Terminal.vue';
import GameMap from './components/GameMap.vue';
import Sidebar from './components/Sidebar.vue';  
import Stats from './components/Stats.vue';

const area = {
  entities: {
    '0': { bg: 'grass', emoji: ' ', name: '', type: '' },
    '1': { bg: 'grass', emoji: '👻', name: 'john', type: 'player' },
    '2': { bg: 'grass', emoji: '🪦', name: 'john\'s headstone', type: 'item', locked: true },
    '3': { bg: 'water', emoji: '⛵', name: 'boat', type: 'item' },
    '4': { bg: 'water', emoji: ' ', name: '', type: 'wall', solid: true },
    '5': { bg: 'forest', emoji: ' ', name: '', type: '' },
    '6': { bg: 'place', emoji: '💾', name: 'wizard floppy', type:'item'},
    '7': { bg: 'forest', emoji: '🐇', name: 'rabbit', type: 'critter' },
    '8': { bg: 'grass', emoji: '🧙‍♂️', name: 'wizard guide', type:'npc' },
    '9': { bg: 'grass', emoji: '🎃', name: 'jack', type: 'npc' },
    'A': { bg: 'forest', emoji: '🕷️', name: 'spider', type: 'enemy' },
    'B': { bg: 'forest', emoji: '🦇', name: 'bat', type: 'enemy' }
  },
  rows: [
    '555555555',
    '555000555',
    '555000555',
    '555020555',
    '555010555',
    '555000005',
    '555000005',
    '555860009',
    '444444443'
  ],
}

export default Vue.extend({
  components: {
    Terminal,
    GameMap,
    Sidebar,
    Stats,
  },
  data () {
    return {
      rows: area.rows
        .map(x => x.split('').map(id => area.entities[id]))
    }
  },
  methods: {
    handleLine (line) {
      console.log('handleline got line:', line)
    }
  }
});
</script>