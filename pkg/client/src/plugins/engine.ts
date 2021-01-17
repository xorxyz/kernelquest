/* eslint-disable no-param-reassign */

import Engine from '../../../engine/src/engine';
import InputController from '../services/input-controller';
import WebSocketClient from '../services/websocket-client';
import { IPlayerCommand } from '../../../engine/src/ecs';

declare module 'vue/types/vue' {
  interface VueConstructor {
    $inputs: InputController
    $engine: Engine
    $ws: WebSocketClient
  }
}

export default function enginePlugin(engine: Engine) {
  const plugin = {
    install(V) {
      const ws = new WebSocketClient();
      const inputs = new InputController();

      inputs.on('command', (line) => {
        const playerId = '96a2c440-9415-47f7-871c-f41f631699a1';
        const command: IPlayerCommand = {
          playerId,
          line,
          timestamp: Date.now(),
          frame: engine.currentFrame,
        };
        engine.scheduleCommand(command);
        ws.sendCommand(command);
      });

      V.prototype.$ws = ws;
      V.prototype.$inputs = inputs;
      V.prototype.$engine = engine;
    },
  };

  return plugin;
}
