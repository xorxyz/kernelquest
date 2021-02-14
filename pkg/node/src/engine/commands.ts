import { Actor } from './actors';

export abstract class Command {
  abstract execute();
}

export class MoveCommand extends Command {
  x: number
  y: number
  actor: Actor

  constructor(actor: Actor, x: number, y: number) {
    super();

    this.x = x;
    this.y = y;
    this.actor = actor;
  }

  execute() {
    this.actor.transform.position.addX(this.x);
    this.actor.transform.position.addY(this.y);
  }
}
