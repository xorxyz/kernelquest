import { GameSystem, SystemComponents } from '../../lib/ecs';
import PositionComponent from '../components/position';

const id = 'movement'

export default class MovementSystem extends GameSystem {
  constructor () {
    super(id, [PositionComponent])
  }

  updateFn(entity: Entity) {
    components.get(id)
  }
}
// 'command', [CommandComponent.type], updateFn
// eslint-disable-next-line @typescript-eslint/no-unused-vars
