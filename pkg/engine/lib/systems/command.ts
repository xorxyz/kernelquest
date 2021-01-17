import { Entity, GameSystem, IPlayerCommand } from '../../src/ecs';
import { ComponentType } from '../components';
import CommandComponent from '../components/command';

const { Command } = ComponentType;

export default class CommandSystem extends GameSystem {
  constructor() {
    super('command', [Command]);
  }

  update(frame: number, commands: Array<IPlayerCommand>) {
    this.entities.forEach((entity) => {
      const command = commands.find((c) => c.playerId === entity.components.get(Command)?.data.playerId);

      if (command) {
        console.log('got command:', command);
        updateCommand(entity, command);
      }
    });
  }
}

function updateCommand(entity: Entity, command: IPlayerCommand) {
  const component = entity.components.get(Command) as CommandComponent;

  if (!command) {
    console.warn('there should be a command here:', entity);
    return false;
  }

  component.data.previousLine = component.data.line;
  component.data.line = command.line;

  return true;
}
