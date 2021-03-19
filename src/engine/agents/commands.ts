import { Agent } from './agents';
import { Item } from '../things/items';
import { Terminal } from '../../shell/terminal';
import { Vector } from '../../../lib/math';
import { debug } from '../../../lib/logging';

const directions = [
  new Vector(0, -1),
  new Vector(1, 0),
  new Vector(0, 1),
  new Vector(-1, 0),
];

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
    if (!agent.stamina) return false;
    agent.stamina.decrease(1);
    agent.velocity.setXY(this.x, this.y);
    if (agent.dragging) {
      agent.velocity.setXY(this.x, this.y);
    }
    return true;
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
  execute(agent: Agent) {
    const { x, y } = agent.facing;
    const idx = directions.findIndex((d) => d.x === x && d.y === y);
    const nextIndex = idx === 3 ? 0 : idx + 1;
    agent.facing.copy(directions[nextIndex]);
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
  item: Item|null

  constructor(item: Item|null) {
    super();
    this.item = item;
  }

  execute(agent:Agent) {
    if (agent.dragging) {
      // const cell = agent.model.room.cells[agent.dragging.position.y][agent.dragging.position.x];
      // cell.stack.push(agent.dragging);
      debug(agent.model.room.cells[agent.dragging.position.y][agent.dragging.position.x]);
      agent.drag(agent.facing, null);
      return true;
    }

    if (!this.item) {
      return false;
    }

    this.item.position.setXY(agent.position.x, agent.position.y);
    const idx = agent.items.findIndex((x) => x === this.item);
    agent.items.splice(idx);
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

export class PrintInventory extends Command {
  execute() {
    return true;
  }
}
