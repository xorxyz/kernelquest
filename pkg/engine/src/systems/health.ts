import { GameSystem } from '../../lib/ecs';

export default class HealthSystem extends GameSystem {
  constructor () {
    super('health', ['health'])
  }

  update(delta) {
    this.entities.forEach(entity => {
      const health = entity.components.get('health')
    })
  }
}
