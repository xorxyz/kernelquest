import * as VueRouter from 'vue-router';
import * as vue from 'vue';
import App from './App.vue';
import Score from './pages/Score.vue';
import Levels from './pages/Levels.vue';
import SingleLevel from './pages/SingleLevel.vue';
import Editor from './pages/Editor.vue';
import Game from './pages/Game.vue';
import Emoji from './components/Emoji.vue';

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    { path: '/', redirect: '/levels' },
    { path: '/scoreboard', component: Score },
    { path: '/levels', component: Levels },
    { path: '/levels/:levelId', component: SingleLevel },
    { path: '/editor', component: Editor },
    { path: '/game', component: Game },
  ],
});

const app = vue.createApp(App);

app.component('Emoji', Emoji);
app.use(router);
app.mount('#app');
