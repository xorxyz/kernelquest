import { Agent } from './agents';
import { Item } from '../things/items';
import { Vector } from '../../../lib/math';

export abstract class Command {
  agent: Agent
  constructor(agent: Agent) {
    this.agent = agent;
  }

  abstract execute(a, e): Boolean;
}

export class Move extends Command {
  x: number
  y: number

  constructor(agent, x: number, y: number) {
    super(agent);

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

  constructor(agent, message: string) {
    super(agent);

    this.message = message;
  }

  execute() {
    return true;
  }
}

export class Drop extends Command {
  agent: Agent
  item: Item

  constructor(agent: Agent, item: Item) {
    super(agent);

    this.item = item;
  }

  execute(items: Array<Item>) {
    const idx = this.agent.items.findIndex((x) => x === this.item);
    this.agent.items.splice(idx);
    items.push(this.item);
    return true;
  }
}

export class PickUp extends Command {
  position: Vector
  constructor(actor: Agent, position: Vector) {
    super(actor);
    this.position = position;
  }
  execute(actor: Agent, item: Item) {
    actor.items.push(item);
    return true;
  }
}
