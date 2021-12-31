import * as VueRouter from 'vue-router';
import * as vue from "vue";
import App from "./App.vue";
import Scoreboard from "./scoreboard/Scoreboard.vue";
import Levels from "./listing/Levels.vue";
import Summary from "./listing/Summary.vue";
import Editor from "./editor/Editor.vue";
import Game from "./game/Game.vue";
import { Engine } from "../../game/engine";
import { World } from '../../game/engine/world';
    
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes: [
    { path: '/', redirect: '/scoreboard' },
    { path: '/scoreboard', component: Scoreboard },
    { path: '/levels', component: Levels },
    { path: '/levels/:levelId', component: Summary },
    { path: '/editor', component: Editor },
    { path: '/game', component: Game },
  ],
});

const app = vue.createApp(App);

app.config.globalProperties.$engine = new Engine({ 
  world: new World()
})

app.use(router);
app.mount("#app");
