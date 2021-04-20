import { Stack } from '../../lib/stack';
import { Compiler, RuntimeError } from './language';
import { Points, Queue } from './lib';
import { Thing } from './things';
import { Action, NoAction } from './actions';

export class HP extends Points {}
export class SP extends Points {}
export class MP extends Points {}
export class GP extends Points {}

export class Agent extends Thing {
  experience: number = 0
  get level() { return 1; }

  hp = new HP()
  sp = new SP()
  mp = new MP()
  gp = new GP()

  get isAlive() { return this.hp.value > 0; }

  private queue: Queue<Action> = new Queue()
  private stack: Stack<Thing> = new Stack()
  private compiler: Compiler = new Compiler()

  schedule(action: Action) {
    this.queue.add(action);
  }

  takeTurn() {
    const action = new NoAction();

    return action;
  }

  exec(code: string) {
    const program = this.compiler.compile(code);
    const execution = new Execution(program, this.stack);

    try {
      execution.start();
    } catch (err) {
      if (!(err instanceof RuntimeError)) {
        console.error('Unhandled error:', err);
      }
    }

    return true;
  }
}

export class Player extends Agent {
  online = true
}

export class NPC extends Agent {}
export class Critter extends Agent {}
export class Monster extends Agent {}
