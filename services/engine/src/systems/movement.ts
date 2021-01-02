import { GameSystem } from '../core/classes';
import { ComponentMap } from '../core/types';

const types = ['position'];

export default new GameSystem('movement', types, updateFn);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateFn(components: ComponentMap) {
  // todo
}
