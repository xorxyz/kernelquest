import Engine from '../../../engine/src';
import MovementSystem from '../../../engine/src/systems/movement';

const engine: Engine = new Engine({}, [
  new MovementSystem(),
]);

export default engine;
