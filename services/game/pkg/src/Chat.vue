<template lang="pug">
.chat.relative.bottom-0.shadow-2.flex.bg-black-50.pa2.br2.shadow-2.flex-column.tl.h-100
  #chat-messages.w-100.h-100.flex.white.flex-column.overflow-y-scroll.mv1.code
    div(v-for="val in messages") #{val}
  form#chat-form.pa0.ma0(@submit.prevent="onInput")
    input#chat-input.br2.bw0.pa2.w-100.bg-light-eggplant(type="text" name="command")

</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    onInput () {
      console.log('enter')
    }
  },
  data() {
    return {
      messages: []
    }
  }
})
</script>