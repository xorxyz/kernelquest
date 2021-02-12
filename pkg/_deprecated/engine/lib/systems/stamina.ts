import { GameSystem } from '../../src/ecs';
import { ComponentType } from '../components';

export default class StaminaSystem extends GameSystem {
  constructor() {
    super('stamina', [ComponentType.Stamina]);
  }

  update() {

  }
}
