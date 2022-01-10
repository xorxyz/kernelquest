import { Direction, Points, Vector } from 'xor4-lib/math';
import { Queue } from 'xor4-lib/queue';
import { Interpreter } from 'xor4-interpreter';
import { Stack } from 'xor4-lib/stack';
import { Factor } from 'xor4-interpreter/types';
import { Thing } from './things';
import { Action } from './actions';
import { Cell } from './cell';
import { World } from './world';

export abstract class RuntimeError extends Error {}

export class HP extends Points {}
export class SP extends Points {}
export class MP extends Points {}
export class GP extends Points {}

export abstract class AgentType {
  abstract name: string
  public appearance: string = '@@';
  public capabilities: Array<Capability> = [];
}

export class Mind {
  public stack: Stack<Factor> = new Stack();
  private interpreter: Interpreter;
  private world: World;

  constructor() {
    this.interpreter = new Interpreter(this.stack);
    this.world = new World([]);
  }

  interpret(code: string) {
    const interpretation = this.interpreter.interpret(code);
    return interpretation;
  }
}

export class Body {
  public position: Vector = new Vector(0, 0);
  public direction: Direction = new Direction(Direction.South);
  public velocity: Vector = new Vector(0, 0);
  public cursorPosition: Vector = new Vector(0, 0);

  get isLookingAt() {
    return this.position.clone().add(this.direction.vector);
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
    if (this.hand || !this.cell) return false;
    this.hand = this.cell.take();
    return true;
  }

  drop(): boolean {
    if (!this.hand || !this.cell || this.cell.isBlocked) return false;

    this.cell.put(this.hand);
    this.hand = null;

    return true;
  }

  render() {
    if (!this.isAlive) return '☠️';
    return this.type.appearance;
  }

  schedule(action: Action) {
    this.queue.add(action);
  }

  takeTurn(tick: number): Action | null {
    this.type.capabilities.forEach((capability) => capability.run(this, tick));
    const action = this.queue.next();

    return action;
  }
}

export class Hero extends Agent {
  experience: number = 0;
  get level() { return 1; }
}

export abstract class Foe extends AgentType {}

export abstract class Capability {
  abstract bootstrap (agent: Agent): void
  abstract run (agent: Agent, tick: number): void
}
