import sdk from '@/shared/lib/sdk' 

export default {
  namespaced: true,
  state: {
    user: null
  },
  mutations: {
    login (state, user) {
      state.user = user || { name : '' }
    },
    logout (state) {
      state.user = null
    }
  },
  actions: {
    async signup ({ commit, dispatch }, user) {
      try {
        var newUser = await sdk.signup(user)

      } catch (err) {
        console.error(err, err.statusCode)

        if (err.statusCode === 400) {
          console.log('400')
          await dispatch('layout/createAlert', { 
            title: 'Sorry.', 
            message: 'The server said: "' + error.message + '"'
          }, { root: true })
          console.log('dispatched')
        } else if (err.statusCode === 502) {
          await dispatch('layout/createAlert', { 
            title: 'Sorry.', 
            message: 'The server is probably still loading.'
          }, { root: true })
        } else {
          await dispatch('layout/createAlert', {
            title: 'Oops.',
            message: ''
          }, { root: true })
        }

        throw err
      }
    },
    async activate ({ commit, dispatch}, code) {
      try {
        await sdk.activate(code)

        await dispatch('layout/createAlert', {
          type: 'info',
          title: 'Cool!',
          message: 'You\'re in, buddy.'
        }, { root: true })
      } catch (err) {
        console.error(err)

        await dispatch('layout/createAlert', {
          title: 'Oops.',
          message: 'That code seems invalid.'
        }, { root: true })

        throw err
      }
    },
    async login ({ commit, dispatch }, credentials) {
      try {
        var user = await sdk.login(credentials)

        commit('login', user)

      } catch (err) {
        console.error(err)

        if (err.statusCode === 502) {
          await dispatch('layout/createAlert', {
            title: 'Oops.',
            message:
              'The server is probably not ready yet. ' +
              'Or it crashed.'
          }, { root: true })
        } else if (err.statusCode === 403) {
          await dispatch('layout/createAlert', {
            title: 'Oh no.',
            message: 'Those credentials didn\'t work. \n',
          }, { root: true })
        } else {
          await dispatch('layout/createAlert', {
            title: 'Oh no.',
            message:
              'Something happened. \n' +
              'Or the connection\'s no bueno.' 
          }, { root: true })
        }

        throw err
      }
    },
    async logout ({ commit }) {
      commit('auth/logout')

      try {
        await sdk.logout()
      } catch (err) {
        console.error(err)
        throw err
      }
    }
  }
}
