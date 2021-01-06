import { GameSystem } from '../../lib/ecs';

export default class CommandSystem extends GameSystem {
  constructor () {
    super('command', ['command'])
  }

  update(delta) {

  }
}
