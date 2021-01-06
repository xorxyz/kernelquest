import Vue from 'vue';
import App from './App.vue';
import Emoji from './components/Emoji';
import wsPlugin from './plugins/ws';
import gamePlugin from './plugins/game';

Vue.component('emoji', Emoji);

Vue.use(wsPlugin);
Vue.use(gamePlugin);

const app = new Vue({
  render: (createElement) => createElement(App),
});

app.$mount('#app');
