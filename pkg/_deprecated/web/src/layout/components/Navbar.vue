<template lang="pug">
  #nav.h3.w-100.bg-darkest.white.flex.justify-center.z-2
    .container.w-100.flex.items-center.relative.ph3
      router-link.link.pv0.mr3.grow(to="/" )
        img.mr3(alt="xor" src="/xor.svg" style="height: 2.4rem" )

      router-link.hover-purple.tab.bb.bw2.link.h-100.flex.justify-center.items-center.ph3(to="/play" active-class="is-active")
        span Play
      router-link.hover-purple.tab.bb.bw2.link.h-100.flex.justify-center.items-center.ph3(to="/" active-class="is-active" exact)
        span Discover
      router-link.hover-purple.tab.bb.bw2.link.h-100.flex.justify-center.items-center.ph3(to="/levels" active-class="is-active" exact)
        span Browse

      div.flex-auto &nbsp;

      div.mv0.pv0.flex-auto.tr.flex.flex-row.justify-end.items-center.h-100
        //- div.mh3.pointer.grow.flex.items-center.justify-center.h-100(alt="Show Spellbook" @click="showSpellbook")
        //-   span.has-hover-no-filter
        //-     emoji.is-icon 📕
        //- div.mh3.pointer.grow(alt="Show Shell (ù)" @click="showShell")
        //-   span.has-hover-no-filter
        //-     emoji.is-icon 💻
          //- span.ba.b--white-90.light-gray.pa1.f7.bw2.monospace.fw7.bg-darker >_

        .mh3.pv0.flex.h-100.items-center
          input#user-menu-toggle.dn( type="checkbox" ref="toggle")
          label.mv0.pv0.pointer.link.avatar.is-empty.grow(for="user-menu-toggle" v-if="!$store.state.auth.user")
          label.mv0.pv0.pointer.link.avatar.grow(for="user-menu-toggle" v-if="$store.state.auth.user")
          UserMenuDropdown.absolute.right-0.top-2.mt4(@click="onUserMenuClick" trigger-id="user-menu-toggle")
</template>

<script>
import UserMenuDropdown from '@/layout/components/UserMenuDropdown.vue'

export default {
  components: {
    UserMenuDropdown
  },
  methods: {
    onUserMenuClick () {
      this.$refs.toggle.checked = false
    }
  }
}
</script>