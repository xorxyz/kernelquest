import { Vector } from 'xor4-lib/math';
import { forN } from 'xor4-lib/utils';
import { TTY } from '../ui/tty';
import { Agent, AgentType, Foe, Hero } from './agents';
import { CursorModeHelpText, Keys } from '../constants';
import { Thing } from './things';
import { Room } from './room';
import { HIT, STEP, ROTATE, GET, PUT, DIE, FAIL } from './events';

export abstract class ActionResult {
  public message: string;
  constructor(message: string = '') {
    this.message = message;
  }
}
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
  n: number;
  constructor(n: 0 | 1 | 2 | 3 = 1) {
    super();
    this.n = n;
  }
  perform(ctx: Room, agent: Agent) {
    forN(this.n, () => agent.body.direction.rotate());
    const cell = ctx.cellAt(agent.body.isLookingAt);
    if (cell) agent.cell = cell;
    ctx.emit(ROTATE, { agent });
    return new ActionSuccess();
  }
}

export class StepAction extends Action {
  name = 'step';
  cost = 1;
  perform(ctx: Room, agent: Agent) {
    const target = ctx.cellAt(agent.body.isLookingAt);

    if (target?.containsFoe) {
      agent.hp.decrease(1);
      if (agent.hp.value === 0) {
        ctx.emit(DIE);
      } else {
        ctx.emit(HIT);
      }
      return new ActionFailure();
    }

    if (agent.type instanceof Foe && target?.slot instanceof Hero) {
      target.slot.hp.decrease(1);
      if (target.slot.hp.value === 0) {
        ctx.emit(DIE);
      } else {
        ctx.emit(HIT);
      }
      return new ActionSuccess();
    }

    if (target && !target.isBlocked) {
      const previous = ctx.cellAt(agent.body.position);
      if (previous) previous.slot = null;
      target.slot = agent;
      agent.body.position.add(agent.body.direction.vector);
      agent.cell = ctx.cellAt(agent.body.isLookingAt);
      ctx.emit(STEP, { agent });
      return new ActionSuccess();
    }

    ctx.emit(FAIL, { agent });

    return new ActionFailure();
  }
}

export class BackStepAction extends Action {
  name = 'backstep';
  cost = 1;
  perform(ctx: Room, agent: Agent) {
    const behind = agent.body.position.clone().sub(agent.body.direction.vector);
    const target = ctx.cellAt(behind);

    if (target && target.containsFoe) {
      if (agent.hp.value === 0) {
        ctx.emit(DIE);
      } else {
        ctx.emit(HIT);
      }
      return new ActionFailure();
    }

    if (target && !target.isBlocked) {
      const previous = ctx.cellAt(agent.body.position);
      if (previous) previous.slot = null;
      target.slot = agent;
      agent.body.position.sub(agent.body.direction.vector);
      agent.cell = ctx.cellAt(agent.body.isLookingAt);
      return new ActionSuccess();
    }

    ctx.emit(FAIL);

    return new ActionFailure();
  }
}

export class GetAction extends Action {
  name = 'get';
  cost = 1;
  perform(ctx: Room, agent: Agent) {
    if (!agent.cell || !agent.cell.slot) {
      ctx.emit(FAIL);
      return new ActionFailure('There\'s nothing here.');
    }

    if (agent.hand) {
      ctx.emit(FAIL);
      return new ActionFailure('You hands are full.');
    }

    if (agent.cell.slot instanceof Agent ||
       (agent.cell.slot instanceof Thing && agent.cell.slot.isStatic)) {
      ctx.emit(FAIL);
      return new ActionFailure('You can\'t get this.');
    }

    if (agent.cell && agent.cell.containsFoe) {
      agent.hp.decrease(1);
      ctx.emit(HIT);
      return new ActionFailure();
    }

    agent.get();

    if (agent.hand) {
      ctx.emit(GET);
      return new ActionSuccess();
    }

    ctx.emit(FAIL);

    return new ActionFailure();
  }
}

export class PutAction extends Action {
  name = 'put';
  cost = 1;
  perform(ctx: Room, agent: Agent) {
    if (!agent.hand) {
      ctx.emit(FAIL);

      return new ActionFailure('You are not holding anything.');
    }

    const target = ctx.cellAt(agent.body.isLookingAt);
    if (target && !target.isBlocked && agent.drop()) {
      ctx.emit(PUT);
      return new ActionSuccess();
    }

    ctx.emit(FAIL);

    return new ActionFailure('There\'s already something here.');
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

    ctx.emit(FAIL);

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
      const thing = ctx.cellAt(agent.body.cursorPosition)?.slot || null;
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

export class PrintCursorModeHelpAction extends TerminalAction {
  name = 'print-cursor-mode-help';
  cost = 0;
  terminal: TTY;
  constructor(terminal: TTY) {
    super();
    this.terminal = terminal;
  }
  authorize() { return true; }
  perform() {
    this.terminal.write(`${CursorModeHelpText.join('\n')}\n`);
    return new ActionSuccess();
  }
}
