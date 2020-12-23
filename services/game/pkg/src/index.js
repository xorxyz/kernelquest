import Vue from 'vue';
import App from './App.vue';
import Emoji from './Emoji.vue';

import socket from './sockets.ts';

global.ws = socket;

socket.on('connect', () => {
  console.log(socket.id);
});

Vue.component('emoji', Emoji);

new Vue({ render: (createElement) => createElement(App) }).$mount('#app');
