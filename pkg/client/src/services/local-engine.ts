import Engine from '../../../engine/src/engine';
import MovementSystem from '../../../engine/lib/systems/movement';

const engine: Engine = new Engine({}, [
  new MovementSystem(),
]);

export default engine;
