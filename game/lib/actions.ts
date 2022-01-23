import { Vector } from 'xor4-lib/math';
import { Queue } from 'xor4-lib/queue';
import { Direction } from 'xor4-lib/directions';
import { Action, ActionFailure, ActionResult, ActionSuccess } from '../engine/actions';
import { Place } from '../engine/places';
import { TTY } from '../ui/tty';
import { Agent, AgentType, Foe, Goal, Hero } from '../engine/agents';
import { CursorModeHelpText, Keys } from '../constants';
import { HIT, STEP, ROTATE, GET, PUT, DIE, FAIL } from '../engine/events';
import { Thing } from '../engine/things';
import { Cell, Glyph } from '../engine/cell';
import { Footsteps } from './things';

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
    return new ActionSuccess('');
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
        agent.body.velocity.sub(agent.body.direction.value);
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
          target.slot.body.velocity.add(agent.body.direction.value);
          ctx.emit(HIT);
        }
        return new ActionSuccess();
      }
    }

    if (target && !target.isBlocked) {
      ctx.cellAt(agent.body.position)?.take();
      target.put(agent);
      agent.body.position.add(agent.body.direction.value);
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
    ctx.put(spawned);
    return new ActionSuccess();
  }
}

/*
 * Processes
 * =========
*/

class PriorityQueue {
  items: Map<Cell, number> = new Map();
  put(cell: Cell, priority: number) {
    this.items.set(cell, priority);
  }
  get() {
    const sorted = Array.from(this.items.entries()).sort((a, b) => a[1] - b[1]);
    const cell = sorted[0][0];

    this.items.delete(cell);

    return cell;
  }
  empty() {
    return this.items.size === 0;
  }
}

export class PathfindingAction extends Action {
  name = 'pathfinding';
  cost = 1;
  destination: Vector;
  constructor(destination: Vector) {
    super();
    this.destination = destination;
  }
  perform(ctx: Place, agent: Agent) {
    const goal = new Goal();
    agent.mind.goals.push(goal);

    const actions = this.pathfind(ctx, agent);

    actions.forEach((action) => agent.queue.add(action));

    return new ActionSuccess('Found a path to the destination cell.');
  }

  heuristic(a: Cell, b: Cell) {
    return Math.abs(a.position.x - b.position.x) + Math.abs(a.position.y - b.position.y);
  }

  reconstructPath(cameFrom: Map<Cell, Cell>, start: Cell, end: Cell) {
    const cells: Array<Cell> = [];

    let next = end;

    while (next !== start) {
      cells.push(next);
      next = cameFrom.get(next) as Cell;
    }

    cells.push(start);

    return cells.reverse();
  }

  pathfind(ctx: Place, agent: Agent): Array<Action> {
    const start = ctx.cellAt(agent.body.position) as Cell;
    const end = ctx.cellAt(this.destination) as Cell;
    const frontier = new PriorityQueue();
    const cameFrom: Map<Cell, Cell> = new Map();
    const costSoFar: Map<Cell, number> = new Map();
    const direction = agent.body.direction.clone();

    frontier.put(start, 0);
    costSoFar.set(start, 0);

    while (!frontier.empty()) {
      const current = frontier.get() as Cell;

      if (current.position.equals(this.destination)) break;

      const neighbours = ctx.getCellNeighbours(current, direction);

      neighbours.forEach((neighbour, i) => {
        if (!neighbour || neighbour.isBlocked) return;
        const newCost = costSoFar.get(current) as number + i;
        if (!costSoFar.has(neighbour) || newCost < (costSoFar.get(neighbour) as number)) {
          costSoFar.set(neighbour, newCost);
          const priority = newCost + this.heuristic(neighbour, end);
          frontier.put(neighbour, priority);
          cameFrom.set(neighbour, current);
        }
      });
    }

    const path = this.reconstructPath(cameFrom, start, end);
    const actions = this.buildPathActions(ctx, agent, path);

    return actions;
  }

  buildPathActions(ctx: Place, agent: Agent, path: Array<Cell>): Array<Action> {
    const direction = agent.body.direction.clone();
    const actions: Array<Action> = [];

    path.reduce((current, next) => {
      while (!(current.position.clone().add(direction.value).equals(next.position))) {
        actions.push(new RotateAction());
        actions.push(new WaitAction(1));
        direction.rotate();
      }

      actions.push(new StepAction());
      actions.push(new WaitAction(4));

      return next;
    });

    return actions;
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
    const expr = `${agent.body.cursorPosition.x} ${agent.body.cursorPosition.y} goto`;
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

export class EvalAction extends Action {
  name = 'eval';
  cost = 1;
  text: string;
  constructor(text: string) {
    super();
    this.text = text;
  }
  perform(ctx: Place, agent: Agent) {
    const [err, interpretation] = agent.mind.interpreter.interpret(this.text, agent.queue);

    if (err) {
      return new ActionFailure(err.message);
    }

    const term = interpretation?.stack.map((factor) => factor.toString()).join(' ');

    return new ActionSuccess(`[${term}]`);
  }
}
