const ALERT_DURATION = 5000

export default {
  namespaced: true,
  state: {
    modal: false,
    authModal: false,
    shell: false,
    spellbook: false,
    alerts: []
  },
  mutations: {
    showSpellbook (state) {
      state.modal = true
      state.spellbook = true
    },
    showShell (state) {
      state.modal = true
      state.shell = true
    },
    openAuthModal (state) {
      state.modal = true
      state.authModal = true
    },
    closeModal (state) {
      state.modal = false
      state.spellbook = false
      state.shell = false
      state.authModal = false
    },
    hideShell (state) {
      state.modal = false
      state.shell = false
    },
    closeAuthModal (state) {
      state.modal = false
      state.authModal = false
    },
    addAlert (state, alert) {
      state.alerts.push(alert)
    },
    removeAlert (state, alert) {
      var foundIndex = state.alerts.findIndex(a => a === alert)

      state.alerts.splice(foundIndex, 1)
    }
  },
  actions: {
    createAlert (ctx, alert) {
      this.commit('layout/addAlert', alert)

      setTimeout(() => {
        this.commit('layout/removeAlert', alert)
      }, ALERT_DURATION)
    }
  }
}
