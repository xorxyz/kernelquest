<template lang="pug">
  #user-menu-dropdown(@click="$emit('click')")
    .mt2.ph2.absolute.top-3.right-0.bg-white.black.br3.shadow.flex.flex-column.w5.pv2.z-5

      div(v-if="!loggedIn")
        div.pointer.br3.ma1.black.hover-bg-purple.pv2.ph2.flex.flex-row.items-center(@click="openAuthModal")
          span ⇥
          span.mh2 Log In

      div(v-if="loggedIn")
        router-link.link(to="/me")
          div.br3.ma1.black.hover-bg-purple.pv2.ph2.flex.flex-row.items-center
            .avatar.mr2
            span.mh2 kareniel
        
        div.ph2
          hr.w-100.bg-gray
        router-link.link(to="/logout")
          div.br3.ma1.pv3.black.hover-bg-purple.pv2.ph2.flex.flex-row.items-center
            span.mr3 ⇥
            span Logout
    .modal-bg.z-4.fixed.top-0.left-0.w-100.h-100.bg-black-40.mt0.pointer

</template>

<script>
export default {
  props: {
    triggerId: String
  },
  mounted () {
    var handler = this.onDocumentClick.bind(this)

    document.addEventListener('click', handler)
  },
  destroyed () {
    var handler = this.onDocumentClick.bind(this)

    document.removeEventListener('click', handler)
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.user
    }
  },
  methods: {
    openAuthModal () {
      this.$store.commit('layout/openAuthModal')
    },
    onDocumentClick (e) {
      var el = e.target

      // close the dropdown if the click:
      // 1. wasn't on the toggle button and
      // 2. was outside the dropdown menu
      // if (!this.$el.contains(el)) {
        // el.id !== this.triggerId && 
        // this.$emit('click')
      // }
    }
  }
}
</script>