<template lang="pug">
  transition(name="slide-up")
    .brtl3.brtr3.z-5.fixed.center.top-2.mt5.h-50.bg-term.shadow.b--border(v-if="$store.state.layout.shell" style="width:100ex")
      div.h2.bg-darker.brtl3.brtr3.b--border.bw2.ph2.pv3.flex.justify-center.items-center
        span.fw8.f6.white-80 Local Shell
      div.pa2.w-100.flex.flex-column
        pre.w-100.mv0
          code.monospace.f3.w-100
            |Last login: Mon Jun  3 10:10:43 on ttys001
        pre.flex.flex-row.mv0.items-center
          code.monospace.f3.fw8.purple
            |root@xor:/root$
          input.outline-0.mh2.bg-term.b--none.lh-copy.monospace.white.f3.bl.bw3.flex-auto.b--white(ref="prompt" tabindex="0")

</template>

<script>
export default {
  mounted () {
    var el = this.$refs.prompt

    el.focus()
  }
}
</script>
