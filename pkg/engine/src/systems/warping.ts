import { GameSystem, SystemComponents } from '../../lib/ecs';

const types = ['location'];

export default new GameSystem('warping', types, updateFn);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateFn(components: SystemComponents) {
  // todo
}
