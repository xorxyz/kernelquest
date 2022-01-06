<template>
  <div class="h-100 flex flex-column">
    <header class="w-100 bg-darkest flex">
      <Navbar/>
    </header>

    <main class="w-100 h-100 flex flex-column items-center justify-start pv4">
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
  import Navbar from './components/Navbar.vue';
  import { version } from '../package.json';

  export default defineComponent({
    data () {
      return {
        version: version,
      }
    },
    mounted () {
    },
    components: {
      Navbar
    },
    methods: {
    }
  });
</script>
