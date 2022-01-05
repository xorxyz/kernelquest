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
  abstract name: string
  abstract cost: number
  abstract perform(context: Room, subject: Agent, object?: Agent | Thing): ActionResult

  authorize(agent: Agent) {
    if (agent.sp.value - this.cost < 0) return false; // too expensive sorry
    return true;
  }
}

export class NoAction extends Action {
  name = 'noop';
  cost: 0;
  perform() {
    return new ActionSuccess();
  }
}

export class SwitchModeAction extends Action {
  name = 'switch-mode';
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

export class RotateAction extends Action {
  name = 'rotate';
  cost: 0;
  authorize() { return true; }
  perform(ctx: Room, agent: Agent) {
    if (this.rotateDirection(agent.body.direction)) {
      agent.handleCell(ctx.cellAt(agent.body.isLookingAt));
      return new ActionSuccess();
    }

    return new ActionFailure();
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
  name = 'step';
  cost: 0;
  authorize() { return true; }
  perform(ctx: Room, agent) {
    if (agent.body.velocity.opposes(agent.body.direction) ||
        agent.body.velocity.isZero()) {
      agent.body.velocity.add(agent.body.direction);

      agent.handleCell(ctx.cellAt(agent.body.isLookingAt));
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class BackStepAction extends Action {
  name = 'backstep';
  cost: 0;
  authorize() { return true; }
  perform(ctx: Room, agent: Agent) {
    if (agent.body.velocity.opposes(agent.body.direction) ||
        agent.body.velocity.isZero()) {
      agent.body.velocity.add(agent.body.direction.clone().invert());
      agent.handleCell(ctx.cellAt(agent.body.isLookingAt));
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class GetAction extends Action {
  name = 'get';
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
  name = 'put';
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
  name = 'spawn';
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
  name = 'move-cursor';
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
    if (Room.bounds.contains(this.terminal.cursorPosition.clone().add(this.direction))) {
      this.terminal.cursorPosition.add(this.direction);
    }
    return new ActionSuccess();
  }
}

export class MoveCursorToAction extends TerminalAction {
  name = 'move-cursor-to';
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
  name = 'select-cell';
  cost: 0;
  terminal: TTY;
  constructor(terminal: TTY) {
    super();
    this.terminal = terminal;
  }
  authorize() { return true; }
  perform() {
    this.terminal.switchModes();
    const expr = `${this.terminal.cursorPosition.x} ${this.terminal.cursorPosition.y} ref`;
    this.terminal.lineEditor.line = expr;
    this.terminal.state.line = expr;
    this.terminal.handleTerminalInput(Keys.ENTER);
    this.terminal.switchModes();
    return new ActionSuccess();
  }
}
