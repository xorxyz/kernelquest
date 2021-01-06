/* eslint-disable no-param-reassign */

import Engine from '../../../engine/src';
import InputController from '../services/InputController';
import WebSocketClient from '../services/WebSocketClient';

declare module 'vue/types/vue' {
  interface VueConstructor {
    $ws: WebSocketClient
    $game: {
      inputs: InputController
      engine: Engine
    };
  }
}

const gamePlugin = {
  install(V) {
    const ws = new WebSocketClient();
    const inputs = new InputController();
    const engine = new Engine({}, []);

    const frameId = 1;

    inputs.on('move', (direction: string) => {
      ws.sendCommand(frameId, 'move', [direction]);
    });

    V.prototype.$ws = ws;
    V.prototype.$game = {
      inputs,
      engine,
    };
  },
};

export default gamePlugin;
