<template lang="pug">
  span(v-html="html")
</template>

<script>
export default {
  data () {
    return {
      html: ''
    }
  },
  mounted () {
    if (!this.$slots.default && !this.$slots.default[0]) return

    var vnode = this.$slots.default[0]
    var text = vnode.text || ''

    this.html = global.twemoji.parse(text)
  }
}
</script>
