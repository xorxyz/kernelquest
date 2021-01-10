import { GameSystem } from '../../src/ecs';
import { Vector } from '../../src/math';
import TransformComponent from '../components/transform';

const id = 'movement'

export default class MovementSystem extends GameSystem {
  constructor () {
    super(id, ['transform'])
  }

  update() {
    console.log('update system:', this.id)
    this.entities.forEach(entity => {
      const transform = entity.components.get('transform') as TransformComponent

      transform.data.position.add(transform.data.velocity)

      console.log(transform.data.velocity, transform.data.position)
    })
  }
}
