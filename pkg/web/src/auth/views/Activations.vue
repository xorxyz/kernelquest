<template lang="pug">
  div
    .card(v-if="!$route.params.activationCode")
      h1 You've got mail.

      p We sent you a confirmation email.

    .card(v-if="$route.params.activationCode")
      h1 Thanks.

      p Let's check that activation code...

</template>

<script>
export default {
  async mounted () {
    var code = this.$route.params.activationCode

    if (!code) return

    try {
      await this.$store.dispatch('auth/activate', code)

      this.$router.push('/me')
    } catch (err) {
      console.error(err)
      this.$router.push('/')
    }
  }
}

</script>
