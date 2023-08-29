<template>
  <footer
    id="footer"
    class="w-100 flex justify-center bg-black-30 ph3"
  >
    <div class="container pv4 w-100 tc f7 white-30">
      <p><span id="version">XOR alpha v{{ version }}</span></p>
      <span>Copyright 2019-2022 Jonathan Dupré. All rights reserved.</span>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { version } from '../../package.json';

export default defineComponent({
  data() {
    return {
      version,
    };
  },
});
</script>
