<template lang="pug">
.map.shadow-2.h-100.bg-black-60.br2.flex.flex-column(@keyup="onTab")
  .flex.items-center.justify-center.w-100.f7
    .white.mv2.ph3.pv1.shadow-2.br1
      span 📍
      span.mh1 Valley of the King
    div.mv1.white.mh3
      emoji 🌓 
      span.mh2 12th 3/4 moon
    div.mv1.white.mh3
      emoji ⏳
      span.mh2 43 minutes left

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
                :class="{ 'bg-forest': tile.bg === 'forest', 'bg-green': ['green'].includes(tile.bg) , 'bg-red': tile.bg === 'red', 'bg-blue': tile.bg === 'blue', 'bg-beige': tile.bg === 'beige', 'hover-b--black-30': tile.e, 'bg-place': tile.bg === 'place'}"
              )
                .absolute.w-100.h-100
                  emoji.relative.f1.ma1(
                    :class="{'squeazing-slow': tile.type === 'place' }"
                  ) {{tile.e}}

</template>

<script lang="ts">
import Vue from 'vue';
import Avatar from './Avatar.vue';

const emptyEntity = {
  name: 'Nothing'
}

const playerHash = '0🧙'
const avatars = ['🧙','🧙🏽‍♂️']
const Solids = ['player', 'enemy', 'npc', 'critter']

let interval

export default Vue.extend({
  components: {
    Avatar
  },
  mounted () {
    window.addEventListener('keyup', this.handleKey);
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
    onTab(e) {
      console.log(e)
    },
    select (entity) {
      if (!entity.type) return false
      if (!['player', 'place', 'npc'].includes(entity.type)) return false
      this.$emit('select', entity)
    },
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
        '1': {  type: 'item' },
        '2': { name: 'bot', type: 'npc' },
        '3': { name: 'mrdetective', type: 'player' },
        '4': { name: 'Farmer', type: 'npc' },
        '5': { name: 'some_elf12', type: 'player' },
        '6': { name: 'fae123', type: 'player' },
        '7': { type: 'critter' },
        '8': { type: 'corpse' },
        '9': { name: 'goblin',type: 'enemy' },
        'A': { name: 'ogre', type: 'enemy' },
        'B': { name: 'poo', type: 'enemy' },
        'C': { name: 'devil', type: 'enemy' },
        'D': { type: 'enemy' },
        'E': { type: 'corpse' },
        'F': { type: 'corpse' }  
      },
      rows: [
        [1,2,3,playerHash,5,6,7,8],
        [1,2,'9🦟','A🦟','C🦟',6,7,9],
        [1,2,3,4,5,6,7,8],
        [1,2,3,4,5,0,7,8],
        [1,'2🤖',3,'4🧑‍🌾',5,6,7,8],
        [1,2,'5🧝','3🕵️','6🧚',6,'1💰',8],
        [1,2,3,4,'7🐇',6,7,8],
        [1,2,3,4,5,'8☠️',7,8]
      ],
      tiles: [
        [
          {bg: 'green', e:'🌳'},
          {bg: 'beige', e:'🏔'},
          {bg: 'green', e:''},
          {bg: 'place', e:'🏰', type: 'place', name: 'Castle', level: 3, flags: 0}
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
          {bg: 'place',e:'🏘', type: 'place', name: 'Village', level: 1, flags: 0},
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