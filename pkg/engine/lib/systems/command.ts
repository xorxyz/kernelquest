import { Entity, GameSystem, IPlayerCommand } from '../../src/ecs';
import CommandComponent from '../components/command';

export default class CommandSystem extends GameSystem {
  constructor() {
    super('command', ['command']);
  }

  update(frame: number, queue: Array<IPlayerCommand>) {
    console.log('update system:', this.id);

    queue.forEach((command) => {
      console.log('entities:', this.entities, command);
      const entity = this.entitiesById[command.playerId];

      if (!entity) {
        throw new Error(`command system: could not found entity for: ${command}`);
      }

      updateCommand(entity, command);
    });
  }
}

function updateCommand(entity: Entity, command: IPlayerCommand) {
  const component = entity.components.get('command') as CommandComponent;

  if (command) {
    component.data.line = command.line;
  }

  return true;
}
