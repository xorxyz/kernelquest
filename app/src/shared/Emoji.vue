<template>
  <span v-html="html"></span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data () {
    return {
      html: ''
    }
  },
  mounted () {
    if (!this.$slots.default && !this.$slots.default[0]) return

    var vnode = this.$slots.default[0]
    var text = vnode.text || ''

    this.html = global.twemoji.parse(text)
  }
})
</script>
