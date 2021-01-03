<template lang="pug">
  span(v-html="html")
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      html: ''
    }
  },
  mounted () {
    if (!this.$slots.default || !this.$slots.default[0]) {
      return
    }

    var vnode = this.$slots.default[0]
    var text = vnode.text || ''

    this.html = window.twemoji.parse(text)
  }
})
</script>
