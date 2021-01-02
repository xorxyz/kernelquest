import { GameSystem } from '../core/classes';
import { ComponentMap } from '../core/types';

const types = ['location'];

export default new GameSystem('warping', types, updateFn);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateFn(components: ComponentMap) {
  // todo
}
