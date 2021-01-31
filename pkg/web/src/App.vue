<template lang="pug">
  #app.white.bg-darker.flex.justify-center.items-center.flex-column

    Navbar

    router-view.flex-auto

    Footer(v-if="$route.name !== 'play-home'")

    AuthModal(v-if="$store.state.layout.authModal")
    Shell(v-if="$store.state.layout.shell")

    transition(name="fade")
      .fixed.z-3.flex.top-0.left-0.w-100.h-100.bg-black-50.pointer(
        v-if="$store.state.layout.modal" 
        @click="$store.commit('layout/closeModal')")
        |&nbsp;

    //- Notifications
</template>

<style lang="stylus">
@import 'style/main.styl'
</style>

<script>
import Shell from '@/layout/components/Shell.vue'
import AuthModal from '@/auth/components/AuthModal.vue'
import Notifications from '@/layout/components/Notifications.vue'
import Navbar from '@/layout/components/Navbar.vue'
import Footer from '@/layout/components/Footer.vue'

export default {
  mounted () {
    this.onKeyup = this.onKeyup.bind(this)

    document.addEventListener('keydown', this.onKeyup)
  },
  destroyed () {
    document.removeEventListener('keydown', this.onKeyup)
  },
  methods: {
    onKeyup (e) {
      if (e.keyCode === 192 && !this.$store.state.layout.shell) {
        e.preventDefault()
        this.$store.commit('layout/showShell')
      }

      if (e.keyCode === 27 && this.$store.state.layout.shell) {
        e.preventDefault()
        this.$store.commit('layout/hideShell')  
      }
    }
  },
  components: {
    Shell,
    AuthModal,
    Notifications,
    Navbar,
    Footer
  }
}
</script>
