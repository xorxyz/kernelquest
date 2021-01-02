import Vue from 'vue';
import App from './App.vue';
import Emoji from './components/Emoji.vue';

Vue.component('emoji', Emoji);

new Vue({ render: (createElement) => createElement(App) }).$mount('#app');
