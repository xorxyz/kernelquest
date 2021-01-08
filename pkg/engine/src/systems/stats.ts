import { GameSystem } from '../../lib/ecs';

export default class StatsSystem extends GameSystem {
  constructor () {
    super('stats', ['stats'])
  }

  update(delta) {

  }
}
