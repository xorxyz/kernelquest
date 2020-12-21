<template lang="pug">
.map.shadow-2.h-100.bg-black-60.br2.flex.flex-column.items-center.justify-center
  .flex
    .black-60.bg-parchment.mv3.ph3.pv2.shadow-2.br1
      span 📍
      span.mh2.black-90 Valley of the King

  .flex.w-100.h-100.flex.items-center.justify-center.mv4
    div.relative
      div.absolute.top0.pa4.z-3.clickthrough.ba
        div.flex.flex-column
          .h2.flex(v-for="(row, index) in rows" :index="index")
            .w2.flex.b--black-10.clickthrough(
              v-for="(e, index) in (row.map(hash => entityOf(hash)))"
              :key="index"
            )
              div.w2.h2.pa1.ba.b--black-10.hover-bg-black-10.bw05
                .br2.shadow-1.w-100.h-100.pa05.clickable.tooltip.relative.dib(
                  v-if="e.emoji"
                  :class="{ 'bg-black-50 pulsing-fast': e.type === 'critter', 'bg-yellow pulsing-slow': e.type === 'npc', 'bg-black-80 pulsing-slow': e.type === 'player', 'bg-black-50 glowing': e.type === 'item', 'bg-hot-pink squeazing': e.type === 'enemy', 'bg-purple glowing': e.type === 'corpse' }"
                )
                  emoji.f4 {{ e.emoji }}
                  .tooltip-text.bg-white-80.black.br1.pa1.f7.top-0.ph2
                    | {{ e.name }}
      div.flex.bg-white-90.flex-column.pa4.shadow-2.br1.ba.b--black-20
        div.br1.shadow-2.pa0
          div
            div.flex.w-100.justify-around(v-for="row in tiles")
              div.w3.h3.pa0.flex.justify-center.items-center.relative.ba.b--black-10(
                v-for="tile in row"
                :class="{ 'bg-forest': tile.bg === 'forest', 'bg-green': ['green'].includes(tile.bg) , 'bg-red': tile.bg === 'red', 'bg-blue': tile.bg === 'blue', 'bg-beige': tile.bg === 'beige', 'hover-b--black-30': tile.e }"
              )
                .absolute.w-100.h-100
                  emoji.relative.f1.ma1 {{tile.e}}

</template>

<script lang="ts">
import Vue from 'vue';

const emptyEntity = {
  name: 'Nothing'
}

const playerHash = '0🧙'
const avatars = ['🧙','🧙🏽‍♂️']
const Solids = ['player', 'enemy', 'npc', 'critter']

let interval

export default Vue.extend({
  mounted () {
    window.addEventListener("keyup", this.handleKey);
    interval = setInterval(() => {
      this.handleEnemyMovement()
    }, 2000)
  },
  created() {
    window.addEventListener('keyup', this.handleKey);
  },
  destroyed() {
    window.removeEventListener('keyup', this.handleKey);
  },
  methods: {
    handleKey (e) {
      e.preventDefault()

      switch (e.key) {
        case 'n': 
          this.nextAvatar()
          break
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
    nextAvatar () {
      const emoji = this.playerHash.slice(1)
      const index = avatars.findIndex(a => a === emoji);
      const nextIndex = index >= avatars.length - 1
        ? 0 
        : index + 1;
      var next = avatars[nextIndex];

      const pos = this.findPlayer()

      this.playerHash = '0' + next
      this.rows[pos.y][pos.x] = this.playerHash;
    },
    entityOf (entityHash) {
      if (typeof entityHash !== 'string' || entityHash.length < 2) {
        return emptyEntity
      }

      const id = entityHash.slice(0, 1);
      const emoji = entityHash.slice(1);
      const entity = this.entities[id];

      return { ...entity, emoji }
    },
    nameOf (entityId) {
      return this.entities[entityId]?.name
    },
    moveX (entityHash, x, y) {
      const pos = this.findEntity(entityHash);
      const nextPos = {
        x: pos.x + x,
        y: pos.y + y
      }

      if (isOffbounds(nextPos)) {
        console.log('offbounds', isOffbounds(nextPos))
        return false
      }

      const hashAtNextPos = this.rows[nextPos.y][nextPos.x]
      const entityAtNextPos = this.entityOf(hashAtNextPos)

      if (isOccupied(entityAtNextPos)) {
        return false
      }

      // erase at old position
      this.rows[pos.y][pos.x] = pos.x;
      // // write at new position
      this.rows[nextPos.y][nextPos.x] = entityHash;
      // // overwrite state
      this.rows = [ ...this.rows ];
    },
    move (x, y) {
      const pos = this.findPlayer();
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
      this.rows[pos.y][pos.x] = pos.x;
      // write player at new position
      this.rows[nextPos.y][nextPos.x] = this.playerHash;
      // overwrite state
      this.rows = [ ...this.rows ];
    },
    findPlayer () {
      const y = this.rows.findIndex(r => r.includes(this.playerHash));
      const x = this.rows[y].findIndex(c => c === this.playerHash);

      return { x, y }
    },
    findEntity (hash) {
      const y = this.rows.findIndex(r => r.includes(hash));
      const x = this.rows[y].findIndex(c => c === hash);

      return { x, y }
    },
    handleEnemyMovement() {
      const next = {
        x: coinFlip(),
        y: coinFlip()
      }

      this.moveX('7🐇', next.x, next.y)
    }
  },
  data() {
    return {
      playerHash: playerHash,
      entities: {
        '0': { name: 'john', type: 'player' },
        '1': { name: 'cash', type: 'item' },
        '2': { name: 'anonymous', type: 'player' },
        '3': { name: 'anonymous', type: 'npc' },
        '4': { name: 'anonymous', type: 'player' },
        '5': { name: 'anonymous', type: 'player' },
        '6': { name: 'anonymous', type: 'player' },
        '7': { name: 'rabbit', type: 'critter' },
        '8': { name: 'john\'s body', type: 'corpse' } 
      },
      rows: [
        [1,2,3,playerHash,5,6,7,8],
        [1,2,3,4,5,6,7,'3🕵️'],
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5,0,7,8],
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5,6,'1💰',8],
        [1,2,3,4,'7🐇',6,7,8],
        [1,2,3,4,5,'8☠️',7,8]
      ],
      tiles: [
        [
          {bg: 'green', e:'🌳'},
          {bg: 'beige', e:'🏔'},
          {bg: 'green', e:''},
          {bg: 'green', e:'🏰'}
        ],
        [
          {bg: 'forest', e:'🍄'},
          {bg: 'green', e:''},
          {bg: 'green', e:''},
          {bg: 'green', e:'🌱'}
        ],
        [
          {bg: 'beige', e:''},
          {bg: 'beige', e:''},
          {bg: 'green', e:'🌿'},
          {bg: 'green', e:'🌼'}
        ],
        [
          {bg: 'green',e:''},
          {bg: 'beige',e:'🏘'},
          {bg: 'green',e:'🌳'},
          {bg: 'blue',e:''}
        ]
      ]
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