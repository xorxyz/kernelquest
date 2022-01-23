import { Points, Rectangle, Vector } from 'xor4-lib/math';
import { Direction, EAST, NORTH, SOUTH, WEST } from 'xor4-lib/directions';
import { Queue } from 'xor4-lib/queue';
import { Interpreter } from 'xor4-interpreter';
import { Stack } from 'xor4-lib/stack';
import { Factor } from 'xor4-interpreter/types';
import { Colors, esc, Style } from 'xor4-lib/esc';
import { Compiler } from 'xor4-interpreter/compiler';
import { Thing } from './things';
import { Action } from './actions';
import { Cell } from './cell';
import { PathfindingAction } from '../lib/actions';
import { goto } from '../lib/words';

export abstract class RuntimeError extends Error {}

/**
 states:

  halt (pause ai brain)
  listen (direction, wait for a message to interpret)
  sleep (duration)
  random (speed)
  patrol (row or column)
  find (thing or agent)
  walk (towards route tree root or leaves)
  follow (agent)
  visit (agent's last known position)
  return (bring the flag home and return the value in hand)

*/

export class HP extends Points {}
export class SP extends Points {}
export class MP extends Points {}
export class GP extends Points {}

export abstract class AgentType {
  abstract name: string
  public appearance: string = '@@';
  public capabilities: Array<Capability> = [];
  readonly weight: number = 5;
  readonly style: string = '';
}

export class Goal {}

export class Mind {
  public stack: Stack<Factor> = new Stack();
  public interpreter: Interpreter;
  public goals: Array<Goal> = [];

  constructor() {
    const compiler = new Compiler({
      goto,
    });

    this.interpreter = new Interpreter(compiler, this.stack);
  }
}

export class Body {
  public position: Vector = new Vector(0, 0);
  public direction: Direction = new Direction(SOUTH);
  public velocity: Vector = new Vector(0, 0);
  public cursorPosition: Vector = new Vector(0, 0);

  get isLookingAt() {
    return this.position.clone().add(this.direction.value);
  }
}

export class Agent {
  public name: string = 'anon';
  public type: AgentType;
  public body: Body;
  public mind: Mind;
  public cell: Cell | null = null;
  public hand: Thing | null = null;
  public eyes: Thing | Agent | null = null;
  public hp = new HP();
  public sp = new SP();
  public mp = new MP();
  public gp = new GP();
  public queue: Queue<Action> = new Queue<Action>();
  public flashing: boolean = true;
  public tick: number = 0;
  public isWaitingUntil: null | number = null;
  public dict = {
    pathfinding: PathfindingAction,
  };

  constructor(type: AgentType) {
    this.type = type;
    this.body = new Body();
    this.mind = new Mind();

    type.capabilities.forEach((capability) => {
      capability.bootstrap(this);
    });
  }

  get label() {
    return `${this.type.appearance} ${this.type.name}`;
  }

  get isAlive() {
    return this.hp.value > 0;
  }

  get(): boolean {
    if (this.hand || !this.cell || this.cell instanceof Agent) return false;
    this.hand = this.cell.take() as Thing | null;
    return true;
  }

  drop(): boolean {
    if (!this.hand || !this.cell || this.cell.isBlocked) return false;

    this.cell.put(this.hand);
    this.hand = null;

    return true;
  }

  render() {
    if (!this.isAlive) return '☠️ ';
    return this.type.style
      ? this.type.style + this.type.appearance + esc(Style.Reset)
      : this.type.appearance;
  }

  schedule(action: Action) {
    this.queue.add(action);
  }

  takeTurn(tick: number): Action | null {
    this.tick = tick;
    this.type.capabilities.forEach((capability) => capability.run(this, tick));

    if (this.isWaitingUntil) {
      if (this.tick >= this.isWaitingUntil) {
        this.isWaitingUntil = null;
      } else {
        return null;
      }
    }

    const action = this.queue.next();

    return action;
  }

  isFacing(vector: Vector) {
    // eslint-disable-next-line prefer-const
    let x1 = 0; let y1 = 0; let x2 = 16; let y2 = 10;

    if (this.body.direction.value.equals(NORTH)) {
      y1 = 0;
      y2 = this.body.position.y + 1;
    }

    if (this.body.direction.value.equals(EAST)) {
      x1 = this.body.position.x;
      x2 = 16;
    }

    if (this.body.direction.value.equals(SOUTH)) {
      y1 = this.body.position.y;
      y2 = 10;
    }

    if (this.body.direction.value.equals(WEST)) {
      x1 = 0;
      x2 = this.body.position.x + 1;
    }

    const rectangle = new Rectangle(new Vector(x1, y1), new Vector(x2, y2));

    return rectangle.contains(vector);
  }

  sees() {
    // eslint-disable-next-line prefer-const
    let x1 = 0; let y1 = 0; let x2 = 16; let y2 = 10;

    const rect = new Rectangle(new Vector(x1, y1), new Vector(x2, y2));

    return rect;
  }
}

export class Hero extends Agent {
  experience: number = 0;
  get level() { return 1; }
}

export abstract class HeroType extends AgentType {
  style = esc(Colors.Bg.Purple);
}

export abstract class Friend extends AgentType {
  style = esc(Colors.Bg.Yellow);
}

export abstract class Foe extends AgentType {
  style = esc(Colors.Bg.Red);
}

export class Observation {
  subject: Agent;
  action: Action;
  object?: Agent | Thing;
  constructor(subject: Agent, action: Action, object?: Agent | Thing) {
    this.subject = subject;
    this.action = action;
    this.object = object;
  }
}

export abstract class Capability {
  abstract bootstrap (agent: Agent): void
  abstract run (agent: Agent, tick: number, events?: Array<Observation>): void
}
