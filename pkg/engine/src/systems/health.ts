import { GameSystem } from '../../lib/ecs';

export default class HealthSystem extends GameSystem {
  constructor () {
    super('health', ['health'])
  }

  update(delta) {

  }
}
