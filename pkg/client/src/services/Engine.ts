import Engine from '../../../engine/src';
import command from '../../../engine/src/systems/command';
import health from '../../../engine/src/systems/health';

const engine: Engine = new Engine([
  health,
]);

export default engine;
