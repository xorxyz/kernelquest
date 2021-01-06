import WebSocketClient from '../services/WebSocketClient';

declare module 'vue/types/vue' {
  interface VueConstructor {
    $ws: WebSocketClient;
  }
}

const wsPlugin = {
  install(V) {
    // eslint-disable-next-line no-param-reassign
    V.$ws = new WebSocketClient();
  },
};

export default wsPlugin;
