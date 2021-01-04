<template lang="pug">
  .flex.flex-column.w-100.h-100.items-center
    .container.w-100.h-100.flex.flex-column.h-100.pa2.justify-center.items-center
      main.w-100.h-100.b--blue.flex.flex-column
        #top-part.w-100.h-100.flex.flex-row
          .mr1.w-30.h-100.flex.flex-column
            div.h-100
              Sidebar.h-100
            div.mt2
              Stats
          .ml1.w-70.flex.flex-column
            div
              div.bg-black.br2.pv2
                Terminal(@line="handleLine")
            div.pv2
              GameMap(:rows="rows" :tiles="tiles")
</template>

<script lang="ts">
import Vue from 'vue';

import Terminal from './components/Terminal.vue';
import GameMap from './components/GameMap.vue';
import Sidebar from './components/Sidebar.vue';  
import Stats from './components/Stats.vue';

const area = {
  entities: {
    '0': { emoji: ' ', name: '', type: '' },
    '1': { emoji: '👻', name: 'john', type: 'player' },
    '2': { emoji: '🪦', name: 'john\'s headstone', type: 'item', locked: true },
    '3': { emoji: '⛵', name: 'boat', type: 'item' },
    '7': { emoji: '🐇', name: 'rabbit', type: 'critter' },
    '9': { emoji: '🎃', name: 'jack', type: 'npc' },
    'A': { emoji: '🕷️', name: 'spider', type: 'enemy' },
    'B': { emoji: '🦇', name: 'bat', type: 'enemy' },
    'F': { emoji: ' ', type: 'wall', solid: true }
  },
  places: {
    '0': { emoji: ' ', bg: 'white', type: 'ground' },
    '1': { emoji: ' ', bg: 'forest', type: 'ground' },
    '2': { emoji: ' ', bg: 'place', type: 'ground' },
    '3': { emoji: ' ', bg: 'blue', type: 'ground' },
    '4': { emoji: ' ', bg: 'beige', type: 'ground' },
    '5': { emoji: ' ', bg: 'grass', type: 'ground' },
  },
  rows: [
    'FF000FFF',
    '0000000F',
    'F020000F',
    'F010000F',
    'F000000F',
    'F0000009',
    'F0000003',
    'FFFFFFFF'
  ],
  tiles: [
    '1111',
    '1511',
    '1555',
    '1553',
  ]
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
      tiles: area.tiles
        .map(x => x.split('').map(id => area.places[id])),
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