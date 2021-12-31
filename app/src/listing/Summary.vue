<template>
  <div class="br1">
    <div class="bg-dark br3 mv4" style="padding: 2rem; box-shadow: 0px 0px 1rem 0px rgba(0,0,0,0.2);">
      <router-link to="/levels" class="white">Back</router-link>
      <div class="flex items-center justify-between mb1">
        <h1 class="f2">{{ $route.params.levelId }}</h1>
      </div>
      <router-link :to="`/game?level=${ $route.params.levelId }`" 
        class="button pv1 ph3 br3 pointer bg-purple link ph4 pv2 mb3 white" tag="button">Play</router-link>
    </div>
  </div>
</template>

<script lang="ts">import { defineComponent } from "vue";

  export default defineComponent({
    data() {
      return {
        name: "Vue",
      };
    },
  });
</script>

