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
    actor.transform.position.addXY(this.x * 3, this.y);
    console.log(actor);
  }
}
