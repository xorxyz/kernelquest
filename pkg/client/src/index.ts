import Vue from 'vue';
import App from './App.vue';
import Emoji from './components/Emoji';
import enginePlugin from './plugins/engine';

import Engine from '../../engine/src/engine';
import MovementSystem from '../../engine/lib/systems/movement';

const engine: Engine = new Engine({}, [
  new MovementSystem(),
]);

Vue.component('emoji', Emoji);

Vue.use(enginePlugin(engine));

const app = new Vue({
  render: (createElement) => createElement(App),
});

app.$mount('#app');
