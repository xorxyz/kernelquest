import {
  Points, Rectangle, Vector, Direction, EAST, NORTH, SOUTH, WEST, Colors, esc, debug,
} from 'xor4-lib';
import { Body, BodyType, Thing } from './thing';
import { Action, TerminalAction, Capability } from './action';
import { Cell, Glyph } from './cell';
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

/** @category Agent */
export class HP extends Points {}

/** @category Agent */
export class SP extends Points {}

/** @category Agent */
export class MP extends Points {}

/** @category Agent */
export class GP extends Points {}

/** @category Agent */
export abstract class AgentType extends BodyType {
  public weight: number = 10;
  public capabilities: Array<Capability> = [];
}

/** @category Agent */
export abstract class Element extends AgentType {
  style = esc(Colors.Bg.White);
}

/** @category Agent */
export abstract class House extends AgentType {
  style = esc(Colors.Bg.Black);
}

/** @category Agent */
export abstract class Hero extends AgentType {
  style = esc(Colors.Bg.Purple);
}

/** @category Agent */
export abstract class Friend extends AgentType {
  style = esc(Colors.Bg.Yellow);
}

/** @category Agent */
export abstract class Foe extends AgentType {
  style = esc(Colors.Bg.Red);
}

/** @category Agents */
export class Spirit extends Hero {
  name = 'spirit';
  glyph = new Glyph('👼');
  weight = 1;
}

/** @category Agent */
export interface IFacing {
  direction: Direction,
  cell: Cell | null
}

/** @category Agent */
export enum AgentLogType {
  Info,
  Debug
}

/** @category Agent */
export interface AgentLog {
  tick: number,
  message: string,
  type?: AgentLogType,
  eventName?: string,
}

/** @category Agent */
export class Agent extends Body {
  public name: string = 'anon';
  declare public type: AgentType;
  public mind: Mind = new Mind();
  public hand: Agent | Thing | null = null;
  public eyes: Agent | Thing | null = null;
  public hp = new HP();
  public sp = new SP();
  public mp = new MP();
  public gp = new GP();
  public flashing: boolean = true;
  public isWaitingUntil: null | number = null;
  public halted: boolean = false;
  public dict = {};
  public facing: IFacing = {
    direction: new Direction(SOUTH),
    cell: null,
  };
  public cursorPosition: Vector = new Vector(0, 0);
  public experience: number = 0;
  public logs: Array<AgentLog> = [
    { tick: 0, message: 'Use \'help\' for more commands.' },
  ];

  constructor(type: AgentType) {
    super(type);

    this.name = type.name;

    type.capabilities.forEach((capability) => {
      capability.bootstrap(this);
    });
  }

  remember(log: AgentLog) {
    debug('remembering', log);
    this.logs.push(log);
  }

  renderStyle() {
    if (this.type instanceof Hero) {
      return esc(Colors.Bg.Purple);
    }

    return null;
  }

  get level() { return 1; }

  get isAlive() { return this.hp.value > 0; }

  get isLookingAt() {
    return this.position.clone().add(this.facing.direction.value);
  }

  kill() {
    this.hp.value = 0;
  }

  get(): Agent | Thing | null {
    if (this.hand || !this.facing.cell) return this.hand || null;

    this.hand = this.facing.cell.take();

    return this.hand;
  }

  drop(): boolean {
    if (!this.hand || !this.facing.cell || this.facing.cell.isBlocked) return false;

    this.facing.cell.put(this.hand);
    this.hand.position.copy(this.facing.cell.position);
    this.hand = null;

    return true;
  }

  schedule(action: Action) {
    if (action instanceof TerminalAction) {
      this.mind.queue.items.unshift(action);
    } else {
      this.mind.queue.add(action);
    }
  }

  takeTurn(tick: number): Action | null {
    this.mind.update(tick);
    this.type.capabilities.forEach((capability) => capability.run(this, tick));

    if (this.isWaitingUntil) {
      if (this.mind.tick >= this.isWaitingUntil) {
        this.isWaitingUntil = null;
      } else {
        return null;
      }
    }

    // if (this.halted && !(this.mind.queue.peek() instanceof TerminalAction)) {
    //   return null;
    // }

    const action = this.mind.queue.next();

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
