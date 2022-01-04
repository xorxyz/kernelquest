import { DirectionRing, Vector } from 'xor4-lib/math';
import { TTY } from '../ui/tty';
import { Agent, AgentType } from './agents';
import { Keys } from '../constants';
import { Thing } from './things';
import { Room } from './room';

export abstract class ActionResult {}
export class ActionSuccess extends ActionResult {}
export class ActionFailure extends ActionResult {}

export abstract class Action {
  abstract cost: number
  abstract perform(context: Room, subject: Agent, object?: Agent | Thing): ActionResult

  authorize(agent: Agent) {
    if (agent.sp.value - this.cost < 0) return false; // too expensive sorry
    return true;
  }
}

export class NoAction extends Action {
  cost: 0;
  perform() {
    return new ActionSuccess();
  }
}

export class SwitchModeAction extends Action {
  cost: 0;
  terminal: TTY;
  constructor(terminal: TTY) {
    super();
    this.terminal = terminal;
  }
  perform() {
    this.terminal.switchModes();
    return new ActionSuccess();
  }
}

export class MoveAction extends Action {
  cost: 5;
  direction: Vector;
  constructor(direction: Vector) {
    super();
    this.direction = direction;
  }
  perform(ctx, { body }) {
    if (body.velocity.opposes(this.direction) || body.velocity.isZero()) {
      body.velocity.add(this.direction);
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class RotateAction extends Action {
  cost: 0;
  authorize() { return true; }
  perform(ctx, agent: Agent) {
    const result = this.rotateDirection(agent.body.direction)
      ? new ActionSuccess()
      : new ActionFailure();

    return result;
  }

  rotateDirection(v: Vector): boolean {
    try {
      const index = DirectionRing.values.findIndex((x: Vector) => x.equals(v));
      const next = DirectionRing.values[index === DirectionRing.values.length - 1 ? 0 : index + 1];
      v.setXY(next.x, next.y);
      return true;
    } catch (err) {
      console.log('error!', err);
      return false;
    }
  }
}

export class StepAction extends Action {
  cost: 0;
  authorize() { return true; }
  perform(ctx: Room, { body }) {
    if (body.velocity.opposes(body.direction) ||
        body.velocity.isZero()) {
      body.velocity.add(body.direction);
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class BackStepAction extends Action {
  cost: 0;
  authorize() { return true; }
  perform(ctx: Room, { body }) {
    if (body.velocity.opposes(body.direction) ||
        body.velocity.isZero()) {
      body.velocity.add(body.direction.clone().invert());
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class GetAction extends Action {
  cost: 0;
  authorize() { return true; }
  perform(ctx: Room, agent: Agent) {
    if (agent.get()) {
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class PutAction extends Action {
  cost: 0;
  authorize() { return true; }
  perform(ctx: Room, agent: Agent) {
    const targetCell = ctx.cellAt(agent.body.isLookingAt);
    if (!targetCell.isBlocked && agent.drop()) {
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class SpawnAction extends Action {
  cost: 0;
  type: AgentType;
  constructor(type: AgentType) {
    super();
    this.type = type;
  }

  perform(ctx: Room, agent: Agent) {
    const spawned = new Agent(this.type);
    spawned.body.position.copy(agent.body.position).add(agent.body.direction);
    if (!Room.bounds.contains(spawned.body.position)) {
      return new ActionFailure();
    }
    ctx.add(spawned);
    return new ActionSuccess();
  }
}

export abstract class TerminalAction extends Action {}

export class MoveCursorAction extends TerminalAction {
  cost: 0;
  terminal: TTY;
  direction: Vector;
  constructor(terminal: TTY, direction: Vector) {
    super();
    this.terminal = terminal;
    this.direction = direction;
  }
  authorize() { return true; }
  perform() {
    const withinBounds = true;
    if (withinBounds) {
      this.terminal.cursorPosition.add(this.direction);
    }
    return new ActionSuccess();
  }
}

export class MoveCursorToAction extends TerminalAction {
  cost: 0;
  terminal: TTY;
  destination: Vector;
  constructor(terminal: TTY, destination: Vector) {
    super();
    this.terminal = terminal;
    this.destination = destination;
  }
  authorize() { return true; }
  perform() {
    const withinBounds = true;
    if (withinBounds) {
      this.terminal.cursorPosition.copy(this.destination);
    }
    return new ActionSuccess();
  }
}

export class SelectCellAction extends TerminalAction {
  cost: 0;
  terminal: TTY;
  constructor(terminal: TTY) {
    super();
    this.terminal = terminal;
  }
  authorize() { return true; }
  perform() {
    this.terminal.switchModes();
    const expr = `${this.terminal.cursorPosition.x} ${this.terminal.cursorPosition.y} xy`;
    this.terminal.lineEditor.line = expr;
    console.log('line', expr);
    console.log(this.terminal.lineEditor);
    this.terminal.state.line = expr;
    this.terminal.handleTerminalInput(Keys.ENTER);
    this.terminal.switchModes();
    return new ActionSuccess();
  }
}
