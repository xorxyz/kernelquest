import { createAuth0 } from '@auth0/auth0-vue'

export default defineNuxtPlugin((nuxtApp) => {
  const auth0 = createAuth0({
    domain: 'kernelquest.us.auth0.com',
    clientId: 'lvI0iFB0FiRMzSe7zrXHap4BpKzGMbp6',
  });

  if (process.client) {
    nuxtApp.vueApp.use(auth0)
  }

  addRouteMiddleware('auth', () => {
    if (process.client) {
      auth0.checkSession()
      if (!auth0.isAuthenticated.value) {
        auth0.loginWithRedirect({
          appState: {
            target: useRoute().path,
          },
        })
      }
    }
  })
})
