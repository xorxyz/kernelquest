import { Agent } from './agents';
import { Item } from '../things/items';
import { Vector } from '../../../lib/math';
import { Terminal } from '../../shell/shell';

export abstract class Command {
  abstract execute(a, e): Boolean;
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
    agent.velocity.setXY(this.x, this.y);
    return true;
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

export class Drop extends Command {
  item: Item

  constructor(item: Item) {
    super();
    this.item = item;
  }

  execute(agent, items: Array<Item>) {
    const idx = agent.items.findIndex((x) => x === this.item);
    agent.items.splice(idx);
    items.push(this.item);
    return true;
  }
}

export class PickUp extends Command {
  execute(agent: Agent, item: Item) {
    agent.items.push(item);
    return true;
  }
}

export class SwitchMode extends Command {
  execute(terminal: Terminal) {
    terminal.switchModes();
    return true;
  }
}
