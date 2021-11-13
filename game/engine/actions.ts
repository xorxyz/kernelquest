import { threadId } from 'worker_threads';
import { Vector } from '../../lib/math';
import { Terminal } from '../ui/terminal';
import { Agent, AgentType, Critter, NPC } from './agents';
import { bounds, Keys } from './constants';
import { Item, Thing } from './things';
import { Room } from './world';

export abstract class ActionResult {}
export class ActionSuccess extends ActionResult {}
export class ActionFailure extends ActionResult {}

export abstract class Action {
  abstract cost: number
  private context: Room | null = null
  private subject: Agent | null = null
  private object: Agent | Thing | null = null
  abstract perform(context: Room, subject: Agent): ActionResult

  authorize(agent: Agent) {
    if (agent.sp.value - this.cost < 0) return false; // too expensive sorry
    return true;
  }
}

export class NoAction extends Action {
  cost: 0
  perform() {
    return new ActionSuccess();
  }
}

export class SwitchModeAction extends Action {
  cost: 0
  terminal: Terminal
  constructor (terminal: Terminal) {
    super();
    this.terminal = terminal;
  }
  perform() {
    this.terminal.switchModes();
    return new ActionSuccess();
  }
}

abstract class MoveAction extends Action {
  cost: 5
  abstract direction: Vector
  perform(ctx, agent: Agent) {
    if (agent.velocity.opposes(this.direction) ||
        agent.velocity.isZero()) {
      agent.velocity.add(this.direction);
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

class Ring<T> {
  values: Array<T>
  constructor (arr: Array<T>) {
    this.values = arr
  }
  next (value: T) {
    const index = this.values.findIndex((x) => x === value);
    console.log('index', index);
    if (index == -1) throw new Error('invalid value');
    const y = this.values[index + 1];
    return y === undefined
      ? this.values[0] 
      : y
  }
}

const directionRing = new Ring([
  new Vector(1, 0),
  new Vector(0, 1),
  new Vector(-1, 0),
  new Vector(0, -1),
]);

function rotateDirection (v: Vector): boolean {
  try {
    console.log('direction', v)
    const index = directionRing.values.findIndex((x: Vector) => x.equals(v));
    console.log('index', index)
    const next = directionRing.values[index === directionRing.values.length - 1 ? 0 : index + 1]
    console.log('next', next)
    v.setXY(next.x, next.y);
    return true
  } catch (err) {
    console.log('error!', err)
    return false;
  }
}

export class RotateAction extends Action {
  cost: 0
  authorize() { return true }
  perform(ctx, agent: Agent) {
    const result = rotateDirection(agent.direction)
      ? new ActionSuccess()
      : new ActionFailure();

    console.log(result);

    return result;
  }
}

export class SpawnAction extends Action {
  cost: 0
  type: AgentType
  constructor (type: AgentType) {
    super();
    this.type = type;
  }
  perform(ctx: Room, agent: Agent) {
    const spawned = new Agent(this.type);
    spawned.position.copy(agent.position).add(agent.direction);
    if (!bounds.contains(spawned.position)) {
      return new ActionFailure();
    }
    ctx.add(spawned);
    return new ActionSuccess();
  }
}

export abstract class TerminalAction extends Action {}

export class MoveCursorAction extends TerminalAction {
  cost: 0
  terminal: Terminal
  direction: Vector
  constructor (terminal: Terminal, direction: Vector) {
    super();
    this.terminal = terminal;
    this.direction = direction;
  }
  authorize() { return true }
  perform() {
    const withinBounds = true
    if (withinBounds) {
      this.terminal.cursor.position.add(this.direction);
    }
    return new ActionSuccess();
  }
}

export class SelectCellAction extends TerminalAction {
  cost: 0
  terminal: Terminal
  constructor (terminal: Terminal) {
    super();
    this.terminal = terminal;
  }
  authorize() { return true }
  perform() {
    this.terminal.switchModes();
    const expr = this.terminal.cursor.position.x + ' ' + this.terminal.cursor.position.y + ' xy';
    this.terminal.lineEditor.line = expr;
    console.log('line', expr);
    console.log(this.terminal.lineEditor);
    this.terminal.state.line = expr;
    this.terminal.handleTerminalInput(Keys.ENTER);
    return new ActionSuccess();
  }
}