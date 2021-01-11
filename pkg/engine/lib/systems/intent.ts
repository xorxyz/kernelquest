import { GameSystem } from '../../src/ecs';
import { Vector } from '../../src/math';
import { ComponentType } from '../components';
import CommandComponent from '../components/command';
import TransformComponent from '../components/transform';

const { Command, Intent, Transform } = ComponentType;

const directions = ['north', 'east', 'south', 'west'];
const directionVectors = {
  north: new Vector(0, -1),
  east: new Vector(1, 0),
  south: new Vector(0, 1),
  west: new Vector(-1, 0),
};

export default class IntentSystem extends GameSystem {
  constructor() {
    super('intent', [Command, Intent, Transform]);
  }

  update() {
    console.log('update system:', this.id);
    this.entities.forEach((entity) => {
      const command = entity.components.get(ComponentType.Command) as CommandComponent;

      let args;

      if (command.data.line.startsWith('move')) {
        args = command.data.line.split(' ').slice(1);
        const direction = args[0];

        if (directions.includes(direction)) {
          const transform = entity.components.get(Transform) as TransformComponent;

          const vector = directionVectors[direction];
          transform.data.velocity.copy(vector);
        }
      }
    });
  }
}
