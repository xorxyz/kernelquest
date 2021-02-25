import { Actor } from './actors';
import { Item } from '../things/items';
import { Vector } from '../../../lib/geom';

export abstract class Command {
  actor: Actor
  constructor(actor: Actor) {
    this.actor = actor;
  }

  abstract execute(a, e): Boolean;
}

export class Move extends Command {
  x: number
  y: number

  constructor(actor, x: number, y: number) {
    super(actor);

    this.x = x;
    this.y = y;
  }

  execute(actor: Actor) {
    actor.velocity.setXY(this.x, this.y);
    return true;
  }
}

export class Say extends Command {
  message: string

  constructor(actor, message: string) {
    super(actor);

    this.message = message;
  }

  execute() {
    return true;
  }
}

export class Drop extends Command {
  actor: Actor
  item: Item

  constructor(actor: Actor, item: Item) {
    super(actor);

    this.item = item;
  }

  execute(items: Array<Item>) {
    const idx = this.actor.items.findIndex((x) => x === this.item);
    this.actor.items.splice(idx);
    items.push(this.item);
    return true;
  }
}

export class PickUp extends Command {
  position: Vector
  constructor(actor: Actor, position: Vector) {
    super(actor);
    this.position = position;
  }
  execute(actor: Actor, item: Item) {
    actor.items.push(item);
    return true;
  }
}
