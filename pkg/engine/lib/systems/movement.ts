import { SystemType } from '.';
import { GameSystem } from '../../src/ecs';
import { ComponentType } from '../components';
import TransformComponent from '../components/transform';

const { Transform } = ComponentType;

export default class MovementSystem extends GameSystem {
  constructor() {
    super(SystemType.Movement, [Transform]);
  }

  update() {
    console.log('update system:', this.id);
    this.entities.forEach((entity) => {
      const transform = entity.components.get(Transform) as TransformComponent;

      transform.data.position.add(transform.data.velocity);

      console.log(transform.data.velocity, transform.data.position);
    });
  }
}
