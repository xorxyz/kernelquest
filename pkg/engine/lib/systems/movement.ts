import { GameSystem } from '../../src/ecs';

const id = 'movement'

export default class MovementSystem extends GameSystem {
  constructor () {
    super(id, ['transform'])
  }

  update() {
    this.entities.forEach(entity => {
      const transform = entity.components.get('transform')
    })
  }
}
