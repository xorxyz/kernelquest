import Vue from 'vue';

import App from './App.vue';
import Emoji from './components/Emoji.vue';

Vue.component('emoji', Emoji);

const app = new Vue({
  render: (createElement) => createElement(App),
});

app.$mount('#app');
