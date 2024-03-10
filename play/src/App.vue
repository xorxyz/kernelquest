<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <NavBar/>
  <main class="w-100 h-100 flex flex-column items-center justify-start pv4 ">
    <RouterView style="width: 55rem;"/>    
  </main>
  <Footer/>
</template>
