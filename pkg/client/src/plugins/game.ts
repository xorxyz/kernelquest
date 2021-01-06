/* eslint-disable no-param-reassign */

import { Vector } from '../../../engine/lib/math';
import Engine from '../../../engine/src';
import InputController from '../services/InputController';

declare module 'vue/types/vue' {
  interface VueConstructor {
    $game: {
      inputs: InputController
      engine: Engine
    };
  }
}

const gamePlugin = {
  install(V) {
    const inputs = new InputController();

    const engine = new Engine({}, []);

    inputs.on('move', (v: Vector) => {
      console.log('move!', v);
    });

    V.$game = {
      inputs,
      engine,
    };
  },
};

export default gamePlugin;
