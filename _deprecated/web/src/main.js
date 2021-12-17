import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Emoji from './shared/components/Emoji.vue'

Vue.config.productionTip = false

Vue.component('emoji', Emoji)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
