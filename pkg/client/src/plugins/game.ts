/* eslint-disable no-param-reassign */

import Engine from '../../../engine/src';
import InputController from '../services/input-controller';
import WebSocketClient from '../services/websocket-client';
import engine from '../services/local-engine';

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

    inputs.on('move', (direction: string) => {
      const playerAction = { cmd: 'move', args: [direction] };
      engine.schedule(playerAction);
      ws.sendCommand(engine.currentFrame, 'move', [direction]);
    });

    V.prototype.$ws = ws;
    V.prototype.$game = {
      inputs,
      engine,
    };
  },
};

export default gamePlugin;
