<template lang="pug">
  div.w-100.pa2
    div.flex.flex-column.h-100.items-center
      div.w-100.h-100.flex
        main.w-100.h-100.b--blue.flex.justify-center
          div.flex.flex-column
            GameMap(:rows="rows")
            Toolbar
            Terminal(@line="handleLine")
          div.flex.flex-column.items-end
            Paperdoll
            Stats
</template>

<script lang="ts">
import Vue from 'vue';

import Toolbar from './components/Toolbar.vue';
import Terminal from './components/Terminal.vue';
import GameMap from './components/GameMap.vue';
import Paperdoll from './components/Paperdoll.vue';  
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
    '55555555',
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
    Toolbar,
    Terminal,
    GameMap,
    Paperdoll,
    Stats,
  },
  computed: {
    rows () {
      return Array(9).fill(Array(9).fill(0)).map((row, y) => {
        return row.map((_, x) => {
          const hash = area.rows[y][x]
          return area.entities[hash || '0']
        })
      })
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleLine (line) {
      console.log('handleline got line:', line)
      // this.$ws.sendCommand({ line })
    }
  }
});
</script>