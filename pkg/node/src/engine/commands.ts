import { Actor } from './actors';

export abstract class Command {
  abstract execute(a, e): Boolean;
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
    actor.velocity.setXY(this.x, this.y);
    return true;
  }
}
