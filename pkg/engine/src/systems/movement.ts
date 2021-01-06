import { GameSystem } from '../../lib/ecs';

const id = 'movement'

export default class MovementSystem extends GameSystem {
  constructor () {
    super(id, ['position'])
  }

  update(delta) {

  }
}
