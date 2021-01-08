import { GameSystem } from '../../src/ecs';

export default class StatsSystem extends GameSystem {
  constructor () {
    super('stats', ['stats'])
  }

  update(delta) {

  }
}
