import { GameSystem } from '../../src/ecs';

export default class HealthSystem extends GameSystem {
  constructor() {
    super('health', ['health']);
  }

  update() {
    this.entities.forEach((entity) => {
      const health = entity.components.get('health');
    });
  }
}
