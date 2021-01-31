<template lang="pug">
  div
    .card
      h1 Logout
      p (wip) Logging you out now.
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('auth/logout').then(() => {
      this.$router.push('/')
    })
  }
}
</script>