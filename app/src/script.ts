import * as VueRouter from 'vue-router';
import * as vue from 'vue';
import App from './App.vue';
import Score from './score/Score.vue';
import Levels from './levels/Levels.vue';
import SingleLevel from './levels/SingleLevel.vue';
import Editor from './editor/Editor.vue';
import Game from './game/Game.vue';
import Emoji from './shared/Emoji.vue';

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
