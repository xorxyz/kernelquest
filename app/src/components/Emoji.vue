<template>
  <span>
    <slot v-if="false"></slot>
    <span v-html="html"></span>
  </span>
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
    var vnode = this.$slots.default()
    var text = vnode.map(v => v.children).join(' ');

    this.html = global.twemoji.parse(text)
  }
})
</script>
