import { Actor } from './actors';
import { Item } from '../things/items';

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

  execute(actor: Actor) {
    actor.velocity.setXY(this.x, this.y);
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

export class Pick extends Command {
  execute(actor: Actor, item: Item) {
    actor.items.push(item);
    return true;
  }
}
