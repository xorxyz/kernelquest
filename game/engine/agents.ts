import { Points, Rectangle, Vector } from 'xor4-lib/math';
import { Direction, EAST, NORTH, SOUTH, WEST } from 'xor4-lib/directions';
import { Queue } from 'xor4-lib/queue';
import { Colors, esc } from 'xor4-lib/esc';
import { EntityType, Thing } from './things';
import { Action } from './actions';
import { Cell, Glyph } from './cell';
import { PathfindingAction, TerminalAction } from '../lib/actions';
import { Mind } from './mind';

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

export class AgentType extends EntityType {
  public weight: number = 10;
  public capabilities: Array<Capability> = [];
}

export abstract class Hero extends AgentType {
  style = esc(Colors.Bg.Purple);
}

export abstract class Friend extends AgentType {
  style = esc(Colors.Bg.Yellow);
}

export abstract class Foe extends AgentType {
  style = esc(Colors.Bg.Red);
}

export abstract class Capability {
  abstract bootstrap (agent: Agent): void
  abstract run (agent: Agent, tick: number, events?: Array<Observation>): void
}

export interface IFacing {
  direction: Direction,
  cell: Cell | null
}

export class Agent extends Thing {
  public name: string = 'anon';
  declare public type: AgentType;
  public mind: Mind;
  public hand: Agent | Thing | null = null;
  public eyes: Agent | Thing | null = null;
  public hp = new HP();
  public sp = new SP();
  public mp = new MP();
  public gp = new GP();
  public queue: Queue<Action> = new Queue<Action>();
  public flashing: boolean = true;
  public tick: number = 0;
  public isWaitingUntil: null | number = null;
  public halted: boolean = false;
  public dict = {
    pathfinding: PathfindingAction,
  };
  public facing: IFacing = {
    direction: new Direction(SOUTH),
    cell: null,
  };
  public cursorPosition: Vector = new Vector(0, 0);
  public experience: number = 0;

  constructor(type: AgentType) {
    super(type);
    this.mind = new Mind();

    type.capabilities.forEach((capability) => {
      capability.bootstrap(this);
    });
  }
  get level() { return 1; }

  get isAlive() { return this.hp.value > 0; }

  get isLookingAt() {
    return this.position.clone().add(this.facing.direction.value);
  }

  get(): Agent | Thing | null {
    if (this.hand || !this.facing.cell) return this.hand || null;

    this.hand = this.facing.cell.take();

    return this.hand;
  }

  drop(): boolean {
    if (!this.hand || !this.facing.cell || this.facing.cell.isBlocked) return false;

    this.facing.cell.put(this.hand);
    this.hand = null;

    return true;
  }

  schedule(action: Action) {
    if (action instanceof TerminalAction) {
      this.queue.items.unshift(action);
    } else {
      this.queue.add(action);
    }
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

    if (this.halted && !(this.queue.peek() instanceof TerminalAction)) {
      return null;
    }

    const action = this.queue.next();

    return action;
  }

  isFacing(vector: Vector) {
    // eslint-disable-next-line prefer-const
    let x1 = 0; let y1 = 0; let x2 = 16; let y2 = 10;

    if (this.facing.direction.value.equals(NORTH)) {
      y1 = 0;
      y2 = this.position.y + 1;
    }

    if (this.facing.direction.value.equals(EAST)) {
      x1 = this.position.x;
      x2 = 16;
    }

    if (this.facing.direction.value.equals(SOUTH)) {
      y1 = this.position.y;
      y2 = 10;
    }

    if (this.facing.direction.value.equals(WEST)) {
      x1 = 0;
      x2 = this.position.x + 1;
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
