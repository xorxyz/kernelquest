import { GameSystem } from '../../lib/ecs';

export default class StaminaSystem extends GameSystem {
  constructor () {
    super('stamina', ['stats'])
  }

  update(delta) {

  }
}
