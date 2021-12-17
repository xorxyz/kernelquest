import Vue from 'vue'
import Vuex from 'vuex'

import authStore from '@/auth/auth.store.js'
import layoutStore from '@/layout/layout.store.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth: authStore,
    layout: layoutStore
  }
})
