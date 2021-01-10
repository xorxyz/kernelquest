import { GameSystem } from '../../src/ecs';
import { Vector } from '../../src/math';
import CommandComponent from '../components/command';
import IntentComponent, { IntentType } from '../components/intent'
import TransformComponent from '../components/transform'

const directions = [ 'north', 'east', 'south', 'west']
const directionVectors = {
  'north': new Vector(0, -1),
  'east': new Vector(1, 0),
  'south': new Vector(0, 1),
  'west': new Vector(-1, 0)
}

export default class IntentSystem extends GameSystem {
  constructor () {
    super('intent', ['command', 'intent', 'transform'])
  }

  update() {
    console.log('update system:', this.id)
    this.entities.forEach(entity => {
      const command = entity.components.get('command') as CommandComponent
      const intent = entity.components.get('intent') as IntentComponent

      let args

      if (command.data.command.startsWith('move')) {
        args = command.data.command.split(' ').slice(1)
        const direction = args[0]

        if (directions.includes(direction)) {
          const transform = entity.components.get('transform') as TransformComponent

          const vector = directionVectors[direction]
          transform.data.velocity.copy(vector)
        }
      }
    })
  }
}
