import { Vector } from 'xor4-lib/math';
import { TTY } from '../ui/tty';
import { Agent, AgentType } from './agents';
import { Keys } from '../constants';
import { Thing } from './things';
import { Room } from './room';

export abstract class ActionResult {}
export class ActionSuccess extends ActionResult {}
export class ActionFailure extends ActionResult {}

export abstract class Action {
  abstract readonly name: string
  abstract readonly cost: number
  abstract perform(context: Room, subject: Agent, object?: Agent | Thing): ActionResult

  authorize(agent: Agent) {
    if (agent.sp.value - this.cost < 0) return false; // too expensive sorry
    agent.sp.decrease(this.cost);
    return true;
  }
}

export class NoAction extends Action {
  name = 'noop';
  cost = 0;
  perform() {
    return new ActionSuccess();
  }
}

export class SwitchModeAction extends Action {
  name = 'switch-mode';
  cost = 0;
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
  cost = 0;
  perform(ctx: Room, agent: Agent) {
    agent.body.direction.rotate();
    const cell = ctx.cellAt(agent.body.isLookingAt);
    if (cell) agent.cell = cell;
    return new ActionSuccess();
  }
}

export class StepAction extends Action {
  name = 'step';
  cost = 2;
  perform(ctx: Room, agent: Agent) {
    const target = ctx.cellAt(agent.body.isLookingAt);

    if (target && target.containsFoe) {
      agent.hp.decrease(1);
    }

    if (target && !target.isBlocked) {
      const previous = ctx.cellAt(agent.body.position);
      previous?.leave();
      target.enter(agent);
      agent.body.position.add(agent.body.direction.vector);
      agent.cell = ctx.cellAt(agent.body.isLookingAt);
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class BackStepAction extends Action {
  name = 'backstep';
  cost = 2;
  perform(ctx: Room, agent: Agent) {
    const behind = agent.body.position.clone().sub(agent.body.direction.vector);
    const target = ctx.cellAt(behind);

    if (target && !target.isBlocked) {
      const previous = ctx.cellAt(agent.body.position);
      previous?.leave();
      target?.enter(agent);
      agent.body.position.sub(agent.body.direction.vector);
      agent.cell = ctx.cellAt(agent.body.isLookingAt);
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class GetAction extends Action {
  name = 'get';
  cost = 1;
  perform(ctx: Room, agent: Agent) {
    if (agent.get()) {
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class PutAction extends Action {
  name = 'put';
  cost = 1;
  perform(ctx: Room, agent: Agent) {
    const target = ctx.cellAt(agent.body.isLookingAt);
    if (target && !target.isBlocked && agent.drop()) {
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class ReadAction extends Action {
  name = 'read';
  cost = 10;
  perform(ctx: Room, agent: Agent) {
    if (agent.hand) {
      const value = agent.hand.read();
      console.log(value);

      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class SpawnAction extends Action {
  name = 'spawn';
  cost = 0;
  type: AgentType;
  constructor(type: AgentType) {
    super();
    this.type = type;
  }

  perform(ctx: Room, agent: Agent) {
    const spawned = new Agent(this.type);
    spawned.body.position.copy(agent.body.position).add(agent.body.isLookingAt);
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
  cost = 0;
  terminal: TTY;
  direction: Vector;
  constructor(terminal: TTY, direction: Vector) {
    super();
    this.terminal = terminal;
    this.direction = direction;
  }
  authorize() { return true; }
  perform(ctx: Room, agent: Agent) {
    if (Room.bounds.contains(agent.body.cursorPosition.clone().add(this.direction))) {
      agent.body.cursorPosition.add(this.direction);
      const thing = ctx.cellAt(agent.body.cursorPosition)?.look() || null;
      agent.eyes = thing;
    }
    return new ActionSuccess();
  }
}

export class MoveCursorToAction extends TerminalAction {
  name = 'move-cursor-to';
  cost = 0;
  terminal: TTY;
  destination: Vector;
  constructor(terminal: TTY, destination: Vector) {
    super();
    this.terminal = terminal;
    this.destination = destination;
  }
  authorize() { return true; }
  perform(ctx, agent: Agent) {
    const withinBounds = true;
    if (withinBounds) {
      agent.body.cursorPosition.copy(this.destination);
    }
    return new ActionSuccess();
  }
}

export class SelectCellAction extends TerminalAction {
  name = 'select-cell';
  cost = 0;
  terminal: TTY;
  constructor(terminal: TTY) {
    super();
    this.terminal = terminal;
  }
  authorize() { return true; }
  perform(ctx, agent: Agent) {
    this.terminal.switchModes();
    const expr = `${agent.body.cursorPosition.x} ${agent.body.cursorPosition.y} ref`;
    this.terminal.lineEditor.line = expr;
    this.terminal.state.line = expr;
    this.terminal.handleTerminalInput(Keys.ENTER);
    this.terminal.switchModes();
    return new ActionSuccess();
  }
}
