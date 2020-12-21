<template lang="pug">
  div.sidebar.flex.flex-column.ma0.bg-light-eggplant.pa3.br2.shadow-2
    Place

</template>

<script lang="ts">
import Vue from 'vue';
import Place from './Place.vue';
export default Vue.extend({
  components: {
    Place
  }
})
</script>