<template>
  <div class="h-100 flex flex-column">
    <header class="w-100 bg-darkest flex">
      <Navbar />
    </header>

    <main class="w-100 h-100 flex flex-column items-center justify-start pv4 ">
      <router-view style="width: 55rem;" />
    </main>

    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default defineComponent({
  components: {
    Navbar,
    Footer,
  },
});
</script>
