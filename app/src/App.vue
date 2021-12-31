<template>
  <div class="h-100 flex flex-column">
    <header class="pv2 w-100 bg-darkest flex">
      <Navbar/>
    </header>

    <main class="w-100 h-100 flex flex-column items-center justify-start pv1">
      <router-view style="width: 55rem;"></router-view>
    </main>

    <footer id="footer" class="w-100 flex justify-center bg-black-30 ph3">
      <div class="container pv4 w-100 tc f7 white-30">
        <p><span id="version">XOR alpha v{{ version }}</span></p>
        <span>Copyright 2019-2022 Jonathan Dupré. All rights reserved.</span>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from '@vue/runtime-core';
  import Navbar from './layout/Navbar.vue';
  import { Book, Flag, Tree } from '../../game/engine/things';
  import { Vector } from '../../lib/math';
  import { version } from '../package.json';

  export default defineComponent({
    data () {
      return {
        version: version,
      }
    },
    mounted () {
      this.reboot();
      this.$engine.start();
    },
    components: {
      Navbar
    },
    methods: {
      reboot () {
        const trees = [
          [5,0],
          [1,1],
          [3,1],
          [4,1],
          [0,2],
          [1,4],
        ];
      
        const room = this.$engine.world.rooms[0];
        
        trees.forEach(([x,y]) => {
          room.cellAt(Vector.from({ x, y }))
              .items.push(new Tree());
        });
      
        room.cellAt(Vector.from({ x: 4, y: 0 }))
          .items.push(new Book());
      
        room.cellAt(Vector.from({ x: 14, y: 8 }))
          .items.push(new Flag());
      }
    }
  });
</script>
