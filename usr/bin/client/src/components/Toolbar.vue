<template lang="pug">
  div.pa1.flex.w-100.f7.bg-white-20
    button.prevent.mh1(@click="login") login
    input.mh1.br1.bw0.pa1(:value="apiUrl")
    button.prevent.mh1(@click="step") step
    span.white.pa1 frame: {{ getFrame() }}

</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, isReactive } from 'vue'

export default Vue.extend({
  components: {

  },
  props: {
  },
  data () {
    return {
      apiUrl: 'http://localhost:3000'
    }
  },
  methods: {
    getFrame () {
      return this.$engine.frame
    },
    step () {
      this.$engine.update()
      // this.frame = this.$engine.frame
    },
    login () {
      fetch(this.apiUrl + '/login', { credentials: 'include' })
    }
  }
});

</script>