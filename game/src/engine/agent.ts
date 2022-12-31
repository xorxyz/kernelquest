import {
  Points, Rectangle,
  Vector, Direction, EAST, NORTH, SOUTH, WEST, Colors, esc, Style, debug, Stack,
} from '../shared';
import { Dictionary } from '../interpreter';
import { Capability } from './capabilities';
import { Body, BodyType, Thing } from './thing';
import { Cell } from './cell';
import { Mind } from './mind';
import { IAction } from './actions';
import { Area } from './area';

export const TERMINAL_ACTIONS = [
  'switch-mode',
  'move-cursor',
  'move-cursor-to',
  'select-cell',
  'print-cursor-mode-help',
];

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
  public weight = 10;
  public capabilities: Array<Capability> = [];

  get label() {
    return `${this.glyph.value} ${this.name}`;
  }
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
  public name = 'anon';
  declare public type: AgentType;
  public mind: Mind;
  public hand: Thing | null = null;
  public eyes: Agent | Thing | null = null;
  public hp = new HP(10);
  public sp = new SP(0, 10);
  public mp = new MP(10);
  public gp = new GP();
  public flashing = true;
  public isWaitingUntil: null | number = null;
  public halted = false;
  public facing: IFacing = {
    direction: new Direction(SOUTH),
    cell: null,
  };
  public cursorPosition: Vector = new Vector(0, 0);
  public experience = 0;
  public logs: Array<AgentLog> = [
    { tick: 0, message: 'Use \'help\' for more commands.' },
    { tick: 0, message: ' ' },
    { tick: 0, message: ' ' },
    { tick: 0, message: ' ' },
    { tick: 0, message: ' ' },
    { tick: 0, message: ' ' },
    { tick: 0, message: ' ' },
  ];
  public inventory: Stack<Thing> = new Stack();

  public view: Array<string> = [];
  public pwd: string;

  private area: Area;

  constructor(id: number, type: AgentType, words?: Dictionary) {
    super(id, type);

    this.mind = new Mind(words);

    type.capabilities.forEach((capability) => {
      capability.bootstrap(this);
    });
  }

  remember(log: AgentLog) {
    this.logs.push(log);
  }

  render() {
    const glyph = this.hp.value > 0 ? this.type.glyph.value : '💀';

    return this.renderStyle() + glyph + esc(Style.Reset);
  }

  renderStyle() {
    return this.type.style || '';
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
    if (!this.facing.cell) return null;
    if (!(this.facing.cell.slot instanceof Thing)) return null;

    this.hand = this.facing.cell.take() as Thing;
    this.hand.owner = this;

    return this.hand;
  }

  drop(): boolean {
    if (!this.hand || !this.facing.cell || this.facing.cell.isBlocked) return false;

    this.facing.cell.put(this.hand);
    this.hand.position.copy(this.facing.cell.position);
    this.hand = null;

    return true;
  }

  schedule(action: IAction) {
    if (TERMINAL_ACTIONS.includes(action.name)) {
      this.mind.queue.items.unshift(action);
    } else {
      this.mind.queue.add(action);
    }
  }

  takeTurn(tick: number, area: Area): IAction | null {
    // Not ideal, but useful to query from inside the pty
    this.area = area;

    this.see(area);
    this.mind.update(tick);

    if (this.isWaitingUntil) {
      if (this.mind.tick >= this.isWaitingUntil) {
        this.isWaitingUntil = null;
      } else {
        return null;
      }
    }

    this.type.capabilities.forEach((capability) => {
      capability.run(this, tick);
    });

    const action = this.mind.decide();

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

  see(area: Area) {
    this.view = area.render(this.sees());
    const thing = area.cellAt(this.cursorPosition)?.slot || null;
    this.eyes = thing;
  }

  sees() {
    // eslint-disable-next-line prefer-const
    let x1 = 0; let y1 = 0; let x2 = 16; let y2 = 10;

    const rect = new Rectangle(new Vector(x1, y1), new Vector(x2, y2));
    return rect;
  }

  moveCursor(direction: Vector) {
    if (this.sees().contains(this.cursorPosition.clone().add(direction))) {
      this.cursorPosition.add(direction);
    }
  }

  /* ctrl + arrow keys: jump to after the next thing and stop at edges */
  jumpCursor(direction: Vector) {
    const nextPosition = this.cursorPosition.clone().add(direction);

    let cell = this.area.cellAt(nextPosition);
    let foundSomething;

    while (cell) {
      if (foundSomething && !cell.slot) {
        this.cursorPosition.copy(nextPosition);
        return;
      }
      foundSomething = cell.slot;
      nextPosition.add(direction);
      cell = this.area.cellAt(nextPosition);
    }

    this.cursorPosition.copy(nextPosition.sub(direction));
  }

  halt() {
    this.halted = true;
  }
}
