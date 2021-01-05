import { GameSystem, SystemComponents } from '../../lib/ecs';
import CommandComponent from '../components/command';

export default class CommandSystem extends GameSystem {
  constructor () {
    super('command', [CommandComponent.type], updateFn)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function updateFn(components: SystemComponents) {
  // todo
}
