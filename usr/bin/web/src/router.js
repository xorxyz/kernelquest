import Vue from 'vue'
import Router from 'vue-router'

import FourOhFour from './layout/views/404.vue'

// auth
import Activations from './auth/views/Activations.vue'
import Logout from './auth/views/Logout.vue'

// user
import Me from './user/views/Me.vue'
import User from './user/views/User.vue'

// levels
import Levels from './levels/views/Levels.vue'
import CreateLevel from './levels/views/CreateLevel.vue'
import EditLevel from './levels/views/EditLevel.vue'
import Level from './levels/views/Level.vue'

// games
import CreateGame from './games/views/CreateGame.vue'
import Games from './games/views/Games.vue'
import Play from './play/views/Play.vue'

// legal
import FAQ from './legal/views/FAQ.vue'
import Terms from './legal/views/Terms.vue'
import Privacy from './legal/views/Privacy.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'games',
      component: Games,
      alias: '/games'
    },
    {
      path: '/me',
      name: 'me',
      component: Me
    },
    {
      path: '/activations',
      name: 'wait-for-activation',
      component: Activations
    },
    {
      path: '/activations/:activationCode',
      name: 'activations',
      component: Activations
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/users/:userId',
      name: 'user',
      component: User
    },
    {
      path: '/game',
      name: 'create-game',
      component: CreateGame
    },
    {
      path: '/levels',
      name: 'levels',
      component: Levels
    },
    {
      path: '/level',
      name: 'create-level',
      component: CreateLevel
    },
    {
      path: '/levels/:levelId/edit',
      name: 'edit-level',
      component: EditLevel
    },
    {
      path: '/levels/:levelId',
      name: 'level',
      component: Level
    },
    {
      path: '/play',
      name: 'play-home',
      component: Play,
      onBeforeEnter (to, from, next) {
        next('/play/moongose-oracle')
      }
    },
    {
      path: '/play/:gameId',
      name: 'play',
      component: Play
    },
    {
      path: '/faq',
      name: 'FAQ',
      component: FAQ
    },
    {
      path: '/terms',
      name: 'terms',
      component: Terms
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: Privacy
    },
    {
      path: '*',
      name: '404',
      component: FourOhFour
    }
  ],
  scrollBehavior () {
    return { x: 0, y: 0 }
  }
})
