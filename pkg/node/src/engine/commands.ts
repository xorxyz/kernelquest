import { Actor } from './actors';

export abstract class Command {
  abstract execute(a);
}

export class MoveCommand extends Command {
  x: number
  y: number

  constructor(x: number, y: number) {
    super();

    this.x = x;
    this.y = y;
  }

  execute(actor: Actor) {
    actor.position.addXY(this.x, this.y);
    actor.position.setX(Math.max(actor.position.x, 0));
    actor.position.setY(Math.max(actor.position.y, 0));
    actor.position.setX(Math.min(actor.position.x, 9));
    actor.position.setY(Math.min(actor.position.y, 9));
    return true;
  }
}
