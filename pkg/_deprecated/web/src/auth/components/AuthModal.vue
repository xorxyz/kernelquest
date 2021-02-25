<template lang="pug">
  div
    div.fixed.top-0.mt5.bg-white.br3.shadow.z-5.black.pa4.flex.flex-column(style="left:50%; transform: translate(-50%); width: 32rem")
      div.tc
        h2 
          span {{ mode === 0 ? 'Log In to XOR' : 'Join XOR today' }}

      div.flex.flex-row.mb3
        .pa2.bb.b--black-30.pointer(
          :class="tabIsActive(0)" 
          @click="mode = 0")
          |Log In
        .pa2.bb.b--black-30.pointer(
          :class="tabIsActive(1)"
          @click="mode = 1") 
          |Sign Up
        .bb.b--black-30.flex-auto

      form(v-if="mode === 0" ref="login" @submit.prevent="login")

        div.mv2
          label
            strong Username
          br
          input(type="text" min="4" placeholder="albert" minlength="3" maxlength="15" v-model="forms.login.username"  required)

        div.mv2
          label 
            strong Passphrase
          br
          input.fw2.f4.w-100.br2.bw1.b--solid.b--black-30.mv1.pa1(type="password" placeholder="****************" minlength="16" v-model="forms.login.passphrase" required)

        button.is-primary.pv3.dib.pointer.button.tc.w-100.mv2.f4.pa3.white(
          :class="{ 'is-loading': loading }" type="submit" )
          |Log In

      form(v-if="mode === 1" ref="signup" @submit.prevent="signup")

        div.mv2
          label
            strong Invitation Code
          br
          input(type="text"  v-model="forms.signup.code" placeholder="1337" required)

        div.mv2
          label
            strong Username
          br
          input(type="text"  v-model="forms.signup.username"  minlength="3" maxlength="15" placeholder="albert" required)

        div.mv2
          label 
            strong Passphrase
          br
          input(type="password"  minlength="16" v-model="forms.signup.passphrase" placeholder="****************"   required)

        div.mv2
          label 
            strong Email
          br
          input(type="email" required placeholder="albert@website.tld" v-model="forms.signup.email" min="4")

        p 
          small
           | By clicking Sign Up, you are indicating that you have
           | read and agree to the 
           a.link.blue(to="/terms" target="_new")
            emoji 
            span  Terms of Service 
           | and 
           a.link.blue(to="/privacy" target="_new")
            emoji   
            span  Privacy Policy
           |.

        button.button.is-primary.pv3.dib.pointer.tc.w-100.mv2.f4.pa3.white(:class="{ 'is-loading': loading }" type="submit" )
          | Sign Up
    .modal-bg.fixed.top-0.left-0.w-100.h-100.bg-black-50.mt0.pointer(@click="close")

</template>

<script>
import request from 'request-promise'

const HOST = 'http://localhost:9090'

export default {
  data () {
    return {
      mode: 0,
      loading: false,
      forms: {
        login: {
          username: '',
          passphrase: ''
        },
        signup: {
          code: '',
          email: '',
          username: '',
          passphrase: ''
        }
      }
    }
  },
  methods: {
    clearLoginForm () {
      this.forms.login.username = ''
      this.forms.login.passphrase = ''
    },
    clearSignupForm () {
      this.forms.signup.code = ''
      this.forms.signup.email = ''
      this.forms.signup.username = ''
      this.forms.signup.passphrase = ''
    },
    async login () {
      this.loading = true

      try {
        await this.$store.dispatch('auth/login', {
          username: this.forms.login.username,
          passphrase: this.forms.login.passphrase
        })
        
        this.loading = false

        this.close()
        this.clearLoginForm()
        this.$router.push('/me')
      } catch (err) {
        this.loading = false
      }
    },
    async signup (e) {
      this.loading = true

      try {
        var user = await this.$store.dispatch('auth/signup', {
          code: this.forms.signup.code,
          email: this.forms.signup.email,
          username: this.forms.signup.username,
          passphrase: this.forms.signup.passphrase,
        })

        this.loading = false

        this.close()
        this.clearSignupForm()
        this.$router.push('/activations')
      } catch (err) {
        this.loading = false
      }
    },
    tabIsActive (mode) {
      return this.mode === mode
        ? [ 'bw2', 'blue', 'b--blue' ] 
        : []
    },
    close () {
      this.$store.commit('layout/closeAuthModal')
    }
  }
}
</script>

