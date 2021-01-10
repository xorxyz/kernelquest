import { Entity, GameSystem, IPlayerCommand } from '../../src/ecs';
import IntentComponent, { IntentType } from '../components/intent';
import CommandComponent from '../components/command';

export default class CommandSystem extends GameSystem {
  constructor () {
    super('command', ['command'])
  }

  update (frame: number, queue: Array<IPlayerCommand>) {
    console.log('update system:', this.id)
    queue.forEach(action => {
      console.log('entities:', this.entities, action)
      const entity = this.entities
        .find(e => (e.components.get('command') as CommandComponent)?.data.userId === action.userId)

      console.log('entity:', entity)

      if (entity) { this.inputCommand(entity, action.line) }
    })
  }

  inputCommand (entity: Entity, line: string) {
    const command = entity.components.get('command') as CommandComponent

    command.data.command = line
  }
}
