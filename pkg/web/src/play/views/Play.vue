<template lang="pug">
  .w-100.flex.flex-row.flex-auto.container
    .window.w-100.ma3.br2.flex.flex-column(ref="win")
      #window-bar.w-100.h2.flex.flex-row.pv2.bg-darkest.items-center.justify-center
        span.f6 Unix 101

      #window-body.flex.flex-row.flex-auto.mb0.mh0
        #window-main.w-100.flex.flex-column
          Term

</template>

<script>
import fullscreen from '@/shared/lib/fullscreen.js'
import Term from '@/play/components/Term.vue'

export default {
  components: {
    Term
  },
  methods: {
    toggleFullscreen () {
      var el = this.$refs.win

      return fullscreen.toggle(el)
    }
  }
}

</script>
