import { GameSystem } from '../../src/ecs';
import { ComponentType } from '../components';

const { Health } = ComponentType;

export default class HealthSystem extends GameSystem {
  constructor() {
    super('health', [Health]);
  }

  update() {
    this.entities.forEach((entity) => {
      const health = entity.components.get(Health);
    });
  }
}
