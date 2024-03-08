import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from "@auth0/auth0-vue";
import HomeView from '../views/HomeView.vue'
import CallbackView from '../views/CallbackView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: authGuard
    },
    {
      path: "/callback",
      name: "callback",
      component: CallbackView
    },
  ]
})

export default router
