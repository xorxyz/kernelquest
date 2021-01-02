import { GameSystem } from '../core/classes';
import { ComponentMap } from '../core/types';

const types = ['command'];

export default new GameSystem('command', types, updateFn);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateFn(components: ComponentMap) {
  // todo
}
