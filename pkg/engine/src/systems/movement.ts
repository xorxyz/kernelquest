import { GameSystem, SystemComponents } from '../../lib/ecs';

const types = ['position'];

export default new GameSystem('movement', types, updateFn);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateFn(components: SystemComponents) {
  // todo
}
