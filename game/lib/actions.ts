import { Vector } from 'xor4-lib/math';
import { Direction } from 'xor4-lib/directions';
import { debug } from 'xor4-lib/logging';
import { Action, ActionFailure, ActionResult, ActionSuccess } from '../engine/actions';
import { Place } from '../engine/places';
import { TTY } from '../ui/tty';
import { Agent, AgentType, Foe, Goal, Hero } from '../engine/agents';
import { CursorModeHelpText, Keys } from '../constants';
import { HIT, STEP, ROTATE, GET, PUT, DIE, FAIL } from '../engine/events';
import { Thing } from '../engine/things';
import { Cell } from '../engine/cell';

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

export class SetHeadingAction extends Action {
  name = 'face';
  cost = 0;
  direction: Direction;
  constructor(direction: Direction) {
    super();
    this.direction = direction;
  }
  perform(ctx: Place, agent: Agent) {
    agent.body.direction.rotateUntil(this.direction.value);
    ctx.emit(ROTATE, { agent });
    agent.cell = ctx.cellAt(agent.body.position.clone().add(agent.body.direction.value));
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

class PriorityQueue<T> {
  items: Map<T, number> = new Map();

  /* adds an item in the queue */
  put(item: T, priority: number) {
    this.items.set(item, priority);
  }

  /* returns lowest priority item */
  get() {
    const sorted = Array.from(this.items.entries()).sort((a, b) => a[1] - b[1]);
    const item = sorted[0][0];

    this.items.delete(item);

    return item;
  }

  isEmpty() {
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

    if (agent.body.position.equals(this.destination)) {
      return new ActionFailure('Already here.');
    }

    const path = this.pathfind(ctx, agent);

    if (!path.length) {
      return new ActionFailure('Could not find a path.');
    }

    const actions = this.buildPathActions(ctx, agent, path.reverse());

    actions.forEach((action) => agent.queue.add(action));

    return new ActionSuccess('Found a path to the destination cell.');
  }

  heuristic(a: Cell, b: Cell) {
    return Math.abs(a.position.x - b.position.x) + Math.abs(a.position.y - b.position.y);
  }

  getKey(map: Map<Cell, Cell>, val: Cell) {
    const kv = [...map].find(([_, value]) => val === value);
    return kv ? kv[0] : null;
  }

  pathfind(ctx: Place, agent: Agent) {
    const start = ctx.cellAt(agent.body.position);
    const end = ctx.cellAt(this.destination);

    if (!start || !end) {
      debug('no start or no end cell', start, end);
      return [];
    }

    const queue = new PriorityQueue<Cell>();
    const cameFrom: Map<Cell, Cell> = new Map();
    const costSoFar: Map<Cell, number> = new Map();
    const direction = agent.body.direction.clone();
    const visited = new Set<Cell>();

    let reached = false;

    queue.put(start, 0);
    costSoFar.set(start, 0);

    while (!queue.isEmpty()) {
      const current = queue.get();
      const cost = costSoFar.get(current) || Infinity;

      if (current.position.equals(this.destination)) {
        reached = true;
        break;
      }

      const neighbours = ctx.getCellNeighbours(current, direction)
        .filter((x) => x && !visited.has(x));

      neighbours.forEach((candidate, i) => {
        if (!candidate || candidate.isBlocked) return;
        const oldCost = costSoFar.get(candidate) || Infinity;
        // eslint-disable-next-line prefer-const
        let newCost = cost + i;
        const thatDirection = candidate.position.clone().sub(current.position);
        // if neighbour's neighbour cant reach current, cost++
        const next = ctx.cellAt(candidate.position.clone().add(thatDirection));
        if (!next || next.isBlocked) {
          newCost++;
        }

        if (!costSoFar.has(candidate) || newCost < oldCost) {
          costSoFar.set(candidate, newCost);
          const priority = newCost + this.heuristic(candidate, end);
          queue.put(candidate, priority);
          cameFrom.set(candidate, current);
          visited.add(candidate);
        }
      });
    }

    return this.reconstructPath(cameFrom, start, end, reached);
  }

  reconstructPath(cameFrom: Map<Cell, Cell>, start: Cell, end: Cell, reached: boolean) {
    debug('reconstructPath()');
    if (!reached) return [];

    const cells: Array<Cell> = [];

    let next: Cell | undefined = end;

    while (next && next !== start) {
      cells.push(next);
      next = cameFrom.get(next);
      if (cells.length > 30) {
        debug('cells', cells.map((c) => c.position.label));
        debug('start', start);
        debug('end:', end);
        debug('cameFrom', cameFrom);
        debug('reached', reached);
        break;
      }
    }

    cells.push(start);

    return cells;
  }

  buildPathActions(ctx: Place, agent: Agent, path: Array<Cell>): Array<Action> {
    debug('buildPathActions()');
    const actions: Array<Action> = [];
    const previousDirection = agent.body.direction.value.clone();

    path.reduce((current, next) => {
      const direction = next.position.clone().sub(current.position);

      if (!direction.equals(previousDirection)) {
        actions.push(new SetHeadingAction(new Direction(direction)));
        actions.push(new WaitAction(2));
      }

      previousDirection.copy(direction);

      actions.push(new StepAction());
      actions.push(new WaitAction(2));

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

export class SwitchModeAction extends TerminalAction {
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
