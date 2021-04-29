import { debug } from '../../lib/logging';
import { Terminal } from '../ui/terminal';
import { Agent } from './agents';
import { Item } from './things';

export abstract class Command {
  abstract execute(a): Boolean;
}

export class SwitchMode extends Command {
  execute(terminal: Terminal) {
    terminal.switchModes();
    return true;
  }
}

export class Move extends Command {
  x: number
  y: number

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  execute(agent: Agent) {
    debug('move.', this.x, this.y);
    agent.position.setXY(this.x, this.y);
    return false;
  }
}

export class Drag extends Command {
  x: number
  y: number

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  execute(agent: Agent) {
    agent.velocity.setXY(this.x, this.y);
    return true;
  }
}

export class Rotate extends Command {
  execute() {
    return false;
  }
}

export class Say extends Command {
  message: string

  constructor(message: string) {
    super();
    this.message = message;
  }

  execute() {
    return true;
  }
}

export class Wield extends Command {
  execute() {
    return false;
  }
}

export class Drop extends Command {
  item: Item|null

  constructor(item: Item|null) {
    super();
    this.item = item;
  }

  execute() {
    return false;
  }
}

export class PickUp extends Command {
  execute(agent: Agent, item: Item) {
    agent.give(item);
    return false;
  }
}

export class PrintInventory extends Command {
  execute() {
    return true;
  }
}
