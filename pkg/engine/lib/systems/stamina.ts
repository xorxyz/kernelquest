import { GameSystem } from '../../src/ecs';

export default class StaminaSystem extends GameSystem {
  constructor () {
    super('stamina', ['stats'])
  }

  update(delta) {

  }
}
