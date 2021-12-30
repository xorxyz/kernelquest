<template>
  <div class="h-100">
    <header class="pv2 w-100 bg-darkest flex">
      <Navbar/>
    </header>
    <main class="w-100 h-100 flex flex-column items-center justify-center">
      <div id="tabs" class="ba" style="width: 55rem; min-height: 38rem;">

      </div>
    </main>
    <footer id="footer" class="w-100 flex justify-center bg-black-30 ph3">
      <div class="container pv4 w-100 tc f7 white-30">
        <p><span id="version"></span></p>
        <span>Copyright 2019-2022 Jonathan Dupré. All rights reserved.</span>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
  import Navbar from './layout/Navbar.vue';

  export default {
    components: {
      Navbar
    }
  };
</script>
