import { Vector } from 'xor4-lib/math';
import { Action, ActionFailure, ActionResult, ActionSuccess } from '../engine/actions';
import { Place } from '../engine/places';
import { TTY } from '../ui/tty';
import { Agent, AgentType, Foe, Hero } from '../engine/agents';
import { CursorModeHelpText, Keys } from '../constants';
import { HIT, STEP, ROTATE, GET, PUT, DIE, FAIL } from '../engine/events';
import { Thing } from '../engine/things';

/*
 * Actions in the World
 * ====================
*/

export class WaitAction extends Action {
  name = 'wait';
  cost = 0;
  duration: number;
  constructor(duration: number) {
    super();
    this.duration = duration;
  }
  perform(ctx, agent: Agent): ActionResult {
    if (agent.isWaitingUntil !== null) {
      agent.isWaitingUntil += this.duration;
      return new ActionSuccess(`Waiting an additional ${this.duration} ticks.`);
    }
    agent.isWaitingUntil = agent.tick + this.duration;
    return new ActionSuccess(`Waiting for ${this.duration} ticks.`);
  }
}

export class RotateAction extends Action {
  name = 'rotate';
  cost = 0;
  perform(ctx: Place, agent: Agent) {
    agent.body.direction.rotate();
    agent.cell = ctx.cellAt(agent.body.isLookingAt);
    ctx.emit(ROTATE, { agent });
    return new ActionSuccess();
  }
}

export class StepAction extends Action {
  name = 'step';
  cost = 1;
  perform(ctx: Place, agent: Agent) {
    const target = ctx.cellAt(agent.body.isLookingAt);

    if (target?.slot instanceof Agent && target.slot.type instanceof Foe) {
      agent.hp.decrease(1);
      if (agent.hp.value === 0) {
        ctx.emit(DIE);
      } else {
        agent.body.velocity.sub(agent.body.direction.vector);
        ctx.emit(HIT);
      }
      return new ActionFailure();
    }

    if (agent.type instanceof Foe && target?.slot instanceof Hero) {
      if (target.slot.isAlive) {
        target.slot.hp.decrease(1);
        if (target.slot.hp.value === 0) {
          ctx.emit(DIE);
        } else {
          target.slot.body.velocity.add(agent.body.direction.vector);
          ctx.emit(HIT);
        }
        return new ActionSuccess();
      }
    }

    if (target && !target.isBlocked) {
      ctx.cellAt(agent.body.position)?.take();
      target.put(agent);
      agent.body.position.add(agent.body.direction.vector);
      agent.cell = ctx.cellAt(agent.body.isLookingAt);
      ctx.emit(STEP, { agent });
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

export class GetAction extends Action {
  name = 'get';
  cost = 1;
  perform(ctx: Place, agent: Agent) {
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

    if (agent.cell && agent.cell.containsFoe()) {
      agent.hp.decrease(1);
      ctx.emit(HIT);
      return new ActionFailure();
    }

    agent.get();

    if (agent.hand) {
      ctx.emit(GET);
      return new ActionSuccess(`You get the ${(agent.hand as Thing).name}.`);
    }

    ctx.emit(FAIL);

    return new ActionFailure();
  }
}

export class PutAction extends Action {
  name = 'put';
  cost = 1;
  perform(ctx: Place, agent: Agent) {
    if (!agent.hand) {
      ctx.emit(FAIL);

      return new ActionFailure('You are not holding anything.');
    }

    const target = ctx.cellAt(agent.body.isLookingAt);
    if (target && !target.isBlocked && agent.drop()) {
      ctx.emit(PUT);
      return new ActionSuccess(`You put down the ${(target.slot as Thing).name}.`);
    }

    ctx.emit(FAIL);

    return new ActionFailure('There\'s already something here.');
  }
}

export class ReadAction extends Action {
  name = 'read';
  cost = 10;
  perform(ctx: Place, agent: Agent) {
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

  perform(ctx: Place, agent: Agent) {
    const spawned = new Agent(this.type);
    spawned.body.position.copy(agent.body.position).add(agent.body.isLookingAt);
    if (!Place.bounds.contains(spawned.body.position)) {
      return new ActionFailure();
    }
    ctx.add(spawned);
    return new ActionSuccess();
  }
}

/*
 * Processes
 * =========
*/

export class EvalAction extends Action {
  name = 'eval';
  cost = 1;
  text: string;
  constructor(text: string) {
    super();
    this.text = text;
  }
  perform(ctx: Place, agent: Agent) {
    const [err] = agent.mind.interpreter.interpret(this.text);

    if (err) { return new ActionFailure(err.message); }

    const term = agent.mind.stack.map((factor) => factor.toString()).join(' ');

    return new ActionSuccess(`[${term}]`);
  }
}

export class PatrolAction extends Action {
  name = 'patrol';
  cost = 1;
  perform() {
    return new ActionFailure('TODO');
  }
}

/*
 * Terminal Actions
 * ====================
*/

export abstract class TerminalAction extends Action {}

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
  perform(ctx: Place, agent: Agent) {
    if (agent.sees().contains(agent.body.cursorPosition.clone().add(this.direction))) {
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
