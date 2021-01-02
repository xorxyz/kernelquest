<template lang="pug">
.map.shadow-2.h-100.bg-black-60.br2.flex.flex-column
  .flex.items-center.justify-center.w-100.f7
    .white.mv2.ph3.pv1.shadow-2.br1
      span 📍
      span.mh1 Intro
    div.mv1.white.mh3
      emoji 🌓 
      span.mh2 1st 1/4 moon
    div.mv1.white.mh3
      emoji ⏳
      span.mh2 10 minutes left

  #game-map.flex.w-100.h-100.flex.justify-center
    div.relative
      div.absolute.top0.pa4.z-3.clickthrough.ba
        div.flex.flex-column
          .h2.flex(v-for="(row, index) in rows" :index="index")
            .w2.flex.b--black-10.clickthrough(
              v-for="(e, index) in (row.map(hash => entityOf(hash)))"
              :key="index"
            )
              Avatar(:e="e" @select="select")
      div.flex.bg-white-90.flex-column.pa4.shadow-2.br1.ba.b--black-20
        div.br1.shadow-2.pa0
          div
            div.flex.w-100.justify-around(v-for="row in tiles")
              div.w3.h3.pa0.flex.justify-center.items-center.relative.ba.b--black-10(
                v-for="tile in row"
                @click="select(tile)"
                :class="{ 'bg-stone': places[tile].bg === 'stone', 'bg-ice': places[tile].bg === 'ice', 'bg-forest': places[tile].bg === 'forest', 'bg-green': ['green'].includes(places[tile].bg) , 'bg-red': places[tile].bg === 'red', 'bg-blue': places[tile].bg === 'blue', 'bg-beige': places[tile].bg === 'beige', 'bg-grass': places[tile].bg === 'grass', 'hover-b--black-30': tile.emoji, 'bg-place': places[tile].bg === 'place'}"
              )
                .absolute.w-100.h-100
                  emoji.relative.f1.ma1(
                    :class="{'squeazing-slow': tile.type === 'place' }"
                  ) {{places[tile].emoji}}

</template>

<script lang="ts">
import Vue from 'vue';
import Avatar from '../components/Avatar.vue';

const emptyEntity = {
  name: 'Nothing'
}

const playerHash = '1'
const Solids = ['player', 'enemy', 'npc', 'critter']

const system = {
  entities: {
    '0': { emoji: '', name: '', type: '' },
    '1': { emoji: '👻', name: 'john', type: 'player' },
    '2': { emoji: '🪦', name: 'john\'s headstone', type: 'item', locked: true },
    '3': { emoji: '⛵', name: 'gateway', type: 'item' },
    '7': { emoji: '🐇', name: 'rabbit', type: 'critter' },
    '9': { emoji: '🎃', name: 'jack o\'ferry', type: 'npc' },
    'A': { emoji: '🕷️', name: 'spider', type: 'enemy' },
    'B': { emoji: '🦇', name: 'bat', type: 'enemy' },
    'F': { emoji: ' ', type: 'wall', solid: true }
  },
  places: {
    '0': { emoji: '', bg: 'white', type: 'ground' },
    '1': { emoji: '', bg: 'forest', type: 'ground' },
    '2': { emoji: '', bg: 'place', type: 'ground' },
    '3': { emoji: '', bg: 'blue', type: 'ground' },
    '4': { emoji: '', bg: 'beige', type: 'ground' },
    '5': { emoji: '', bg: 'grass', type: 'ground' },
  },
  rows: [
    'FF000FFF',
    '0020000F',
    'F010000F',
    'F000000F',
    'F000000F',
    'F0000009',
    'F0000003',
    'FFFFFFFF'
  ],
  tiles: [
    '5511',
    '5511',
    '1555',
    '1553',
  ]
}


let interval

export default Vue.extend({
  components: {
    Avatar
  },
  mounted () {
    window.addEventListener('keyup', this.handleKey);
  },
  created() {
    window.addEventListener('keyup', this.handleKey);
  },
  destroyed() {
    window.removeEventListener('keyup', this.handleKey);
  },
  methods: {
    select (entity) {
      if (!entity.type) return false
      if (!['player', 'place', 'npc'].includes(entity.type)) return false
      this.$emit('select', entity)
    },
    handleKey (e) {
      e.preventDefault()

      switch (e.key) {
        case 'ArrowUp': 
          this.move(0, -1)
          break
        case 'ArrowRight': 
          this.move(1, 0)
          break
        case 'ArrowDown': 
          this.move(0, 1)
          break
        case 'ArrowLeft': 
          this.move(-1, 0)
          break
        default:
          break
      }
    },
    entityOf (entityHash) {
      const entity = this.entities[entityHash]

      return entity
    },
    nameOf (entityId) {
      return this.entities[entityId]?.name
    },
    moveX (entityHash, x, y) {
      const pos = this.findEntityPosition(entityHash);
      const nextPos = {
        x: pos.x + x,
        y: pos.y + y
      }

      if (isOffbounds(nextPos)) {
        return false
      }

      const hashAtNextPos = this.rows[nextPos.y][nextPos.x]
      const entityAtNextPos = this.entityOf(hashAtNextPos)

      if (isOccupied(entityAtNextPos)) {
        return false
      }

      // erase at old position
      this.rows[pos.y][pos.x] = '0';
      // // write at new position
      this.rows[nextPos.y][nextPos.x] = entityHash;
      // // overwrite state
      this.rows = [ ...this.rows ];
    },
    move (x, y) {
      const pos = this.findPlayerPosition();
      const nextPos = {
        x: pos.x + x,
        y: pos.y + y
      }

      if (isOffbounds(nextPos)) {
        return false
      }

      const hashAtNextPos = this.rows[nextPos.y][nextPos.x]
      const entityAtNextPos = this.entityOf(hashAtNextPos)

      if (isOccupied(entityAtNextPos)) {
        return false 
      }

      // erase player
      this.rows[pos.y][pos.x] = '0';
      // write player at new position
      this.rows[nextPos.y][nextPos.x] = '1';
      // overwrite state
      this.rows = [ ...this.rows ];
    },
    findPlayerPosition () {
      return this.findEntityPosition('1')
    },
    findEntityPosition (hash: string) {
      const y = this.rows.findIndex(r => r.includes(hash));
      const x = this.rows[y].findIndex(c => c === hash);

      return { x, y }
    },
  },
  data() {
    return {
      entities: system.entities,
      places: system.places,
      rows: system.rows.map(x => x.split('')),
      tiles: system.tiles.map(x => x.split(''))
    };
  }
});

function coinFlip () {
  return Math.floor(Math.random() * 2) == 0
    ? 1
    : -1;
}

function isOffbounds (pos) {
  return (
    pos.x < 0 ||
    pos.x > 7 ||
    pos.y < 0 ||
    pos.y > 7
  )
}

function isOccupied (entity) {
  return (
    entity && Solids.includes(entity.type)
  )
}

</script>