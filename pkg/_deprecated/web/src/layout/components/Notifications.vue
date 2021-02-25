<template lang="pug">
  div.notifications
    div.relative.vh-100.vh-100.ph3(style="font-size: 21px;")
      transition-group(name="error")
        .notification(
          v-for="alert, index in $store.state.layout.alerts" 
          :class="{ 'bg-green': alert.type === 'info' }"
          style="width: 28rem;" v-bind:key="index")
          h3.mt0 {{ alert.title }}
          p.mv2 {{ alert.message }}
</template>

