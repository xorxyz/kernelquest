import { GameSystem } from '../../lib/ecs';

const frameActions: Map<string, object> = new Map()

export default class InputSystem extends GameSystem {
  constructor () {
    super('input', ['input'])
  }

  update() {
    this.entities.forEach(entity => {
      const action = frameActions.get(entity.id)

      if (!action) {
        return false
      }

      return true
    })
  }
}
