import { Vector, CursorModeHelpText, Keys, Direction, debug } from 'xor4-lib';
import { Interpretation, LiteralRef } from 'xor4-interpreter';
import { Area } from '../src/area';
import { Agent, AgentType, Foe, Hero } from '../src/agent';
import { Thing } from '../src/thing';
import { Cell, Glyph } from '../src/cell';
// import { DIE, FAIL, GET, HIT, PUT, ROTATE, STEP } from './events';
import { Crown, Flag } from './things';
import { Wind } from './agents';
import { Action, ActionFailure, ActionResult, ActionSuccess, TerminalAction } from '../src';

/*
 * Actions in the World
 * ====================
*/

/** @category Actions */
export class WaitAction extends Action {
  name = 'wait';
  cost = 1;
  duration: number;
  constructor(duration: number) {
    super();
    this.duration = duration;
  }
  perform(ctx, agent: Agent): ActionResult {
    if (agent.isWaitingUntil !== null) {
      agent.isWaitingUntil += this.duration;
      return new ActionSuccess('');
    }
    agent.isWaitingUntil = agent.mind.tick + this.duration;
    return new ActionSuccess('');
  }
}

/** @category Actions */
export class RotateAction extends Action {
  name = 'rotate';
  cost = 1;
  perform(ctx: Area, agent: Agent) {
    agent.facing.direction.rotate();
    agent.facing.cell = ctx.cellAt(agent.isLookingAt);
    // ctx.events.emit(ROTATE, { agent });
    return new ActionSuccess();
  }
}

/** @category Actions */
export class SetHeadingAction extends Action {
  name = 'face';
  cost = 1;
  direction: Direction;
  constructor(direction: Direction) {
    super();
    this.direction = direction;
  }
  perform(ctx: Area, agent: Agent) {
    agent.facing.direction.rotateUntil(this.direction.value);
    // ctx.events.emit(ROTATE, { agent });
    agent.facing.cell = ctx.cellAt(agent.position.clone().add(agent.facing.direction.value));
    return new ActionSuccess();
  }
}

/** @category Actions */
export class StepAction extends Action {
  name = 'step';
  cost = 1;
  perform(ctx: Area, agent: Agent) {
    const target = ctx.cellAt(agent.isLookingAt);

    if (target?.slot instanceof Agent && target.slot.type instanceof Foe) {
      agent.hp.decrease(1);
      if (agent.hp.value === 0) {
        // ctx.events.emit(DIE);
      } else {
        agent.velocity.sub(agent.facing.direction.value);
        // ctx.events.emit(HIT);
      }
      return new ActionFailure();
    }

    if (agent.type instanceof Foe &&
      target?.slot instanceof Agent &&
      target.slot.type instanceof Hero) {
      if (target.slot.isAlive) {
        target.slot.hp.decrease(1);
        if (target.slot.hp.value === 0) {
          // ctx.events.emit(DIE);
          target.slot.type.glyph = new Glyph('☠️ ');
        } else {
          target.slot.velocity.add(agent.facing.direction.value);
          // ctx.events.emit(HIT);
        }
        return new ActionSuccess();
      }
    }

    if (target && (!target.isBlocked)) {
      ctx.cellAt(agent.position)?.take();
      target.put(agent);
      agent.position.add(agent.facing.direction.value);
      agent.facing.cell = ctx.cellAt(agent.isLookingAt);
      // ctx.events.emit(STEP, { agent });
      return new ActionSuccess();
    }

    return new ActionFailure();
  }
}

/** @category Actions */
export class GetAction extends Action {
  name = 'get';
  cost = 1;
  perform(ctx: Area, agent: Agent) {
    if (!agent.facing.cell || !agent.facing.cell.slot) {
      // ctx.events.emit(FAIL);
      return new ActionFailure('There\'s nothing here.');
    }

    if (agent.hand) {
      // ctx.events.emit(FAIL);
      return new ActionFailure('You hands are full.');
    }

    if (agent.facing.cell.slot instanceof Agent ||
       (agent.facing.cell.slot instanceof Thing && agent.facing.cell.slot.type.isStatic)) {
      // ctx.events.emit(FAIL);
      return new ActionFailure('You can\'t get this.');
    }

    if (agent.facing.cell && agent.facing.cell.containsFoe()) {
      agent.hp.decrease(1);
      // ctx.events.emit(HIT);
      return new ActionFailure();
    }

    const thing = agent.get();

    if (thing) {
      // ctx.events.emit(GET);

      if (thing instanceof Thing) {
        thing.owner = agent;

        if (thing.type instanceof Crown) {
          ctx.capturedCrowns.add(thing);
          // ctx.events.emit('crown');
        }

        if (thing.type instanceof Flag) {
          ctx.capturedFlags.add(thing);
          // ctx.events.emit('flag');
        }
      }

      return new ActionSuccess(`You get the ${thing.name}.`);
    }

    // ctx.events.emit(FAIL);

    return new ActionFailure();
  }
}

/** @category Actions */
export class PutAction extends Action {
  name = 'put';
  cost = 1;
  perform(ctx: Area, agent: Agent) {
    if (!agent.hand) {
      // ctx.events.emit(FAIL);

      return new ActionFailure('You are not holding anything.');
    }

    const target = ctx.cellAt(agent.isLookingAt);
    if (target && !target.isBlocked && agent.drop()) {
      // ctx.events.emit(PUT);
      return new ActionSuccess(`You put down the ${(target.slot as Thing).name}.`);
    }

    // ctx.events.emit(FAIL);

    return new ActionFailure('There\'s already something here.');
  }
}

/** @category Actions */
export class ReadAction extends Action {
  name = 'read';
  cost = 10;
  perform(ctx: Area, agent: Agent) {
    if (agent.hand) {
      // const { value } = agent.hand;

      return new ActionSuccess();
    }

    // ctx.events.emit(FAIL);

    return new ActionFailure();
  }
}

/*
 * Processes
 * =========
*/

/** @category Actions */
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

/** @category Actions */
export class PathfindingAction extends Action {
  name = 'pathfinding';
  cost = 1;
  destination: Vector;
  constructor(destination: Vector) {
    super();
    this.destination = destination;
  }
  perform(ctx: Area, agent: Agent) {
    if (agent.position.equals(this.destination)) {
      return new ActionFailure('Already here.');
    }

    const path = this.pathfind(ctx, agent);

    if (!path.length) {
      return new ActionFailure('Could not find a path.');
    }

    const actions = this.buildPathActions(ctx, agent, path.reverse());

    actions.forEach((action) => agent.schedule(action));

    return new ActionSuccess('Found a path to the destination cell.');
  }

  heuristic(a: Cell, b: Cell) {
    return Math.abs(a.position.x - b.position.x) + Math.abs(a.position.y - b.position.y);
  }

  getKey(map: Map<Cell, Cell>, val: Cell) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const kv = [...map].find(([_, value]) => val === value);
    return kv ? kv[0] : null;
  }

  pathfind(ctx: Area, agent: Agent) {
    const start = ctx.cellAt(agent.position);
    const end = ctx.cellAt(this.destination);

    if (!start || !end) {
      debug('no start or no end cell', start, end);
      return [];
    }

    const queue = new PriorityQueue<Cell>();
    const cameFrom: Map<Cell, Cell> = new Map();
    const costSoFar: Map<Cell, number> = new Map();
    const direction = agent.facing.direction.clone();
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

  buildPathActions(ctx: Area, agent: Agent, path: Array<Cell>): Array<Action> {
    debug('buildPathActions()');
    const actions: Array<Action> = [];
    const previousDirection = agent.facing.direction.value.clone();

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

/** @category Actions */
export class PatrolAction extends Action {
  name = 'patrol';
  cost = 1;
  perform() {
    return new ActionFailure('TODO');
  }
}

/** @category Actions */
export class EvalAction extends Action {
  name = 'eval';
  cost = 0;
  text: string;
  constructor(text: string) {
    super();
    this.text = text;
  }

  perform(ctx: Area, agent: Agent) {
    const result = agent.mind.interpret(this.text);

    if (result instanceof Error) {
      debug('result.message', result.message);
      return new ActionFailure(result.message);
    } if (result instanceof Interpretation) {
      const term = result.stack.map((factor) => factor.toString()).join(' ');

      return new ActionSuccess(`[${term}]`);
    }
    return new ActionFailure('Unhandled Exception.');
  }
}

/** @category Actions */
export class LookAction extends Action {
  name = 'look';
  cost = 0;
  ref: LiteralRef;
  constructor(ref: LiteralRef) {
    super();
    this.ref = ref;
  }
  perform(ctx: Area, agent: Agent) {
    const cell = ctx.cellAt(this.ref.vector);
    const seen = cell?.slot;
    if (!seen) {
      agent.logs.push({
        tick: agent.mind.tick,
        message: 'Nothing here.',
      });
    } else {
      agent.logs.push({
        tick: agent.mind.tick,
        message: `${seen.label}`,
      });
    }
    return new ActionSuccess();
  }
}

/** @category Actions */
export class ListAction extends Action {
  name = 'ls';
  cost = 0;
  perform(ctx: Area, agent: Agent) {
    agent.logs.push({
      tick: agent.mind.tick,
      message: ctx.list().map((x) => x.name + x.position.x + x.position.y).join(', '),
    });
    return new ActionSuccess();
  }
}

/** @category Actions */
export class MoveThingAction extends Action {
  name = 'mv';
  cost = 0;
  fromRef: LiteralRef;
  toRef: LiteralRef;

  constructor(fromRef: LiteralRef, toRef: LiteralRef) {
    super();
    this.fromRef = fromRef;
    this.toRef = toRef;
  }

  perform(ctx: Area, agent: Agent) {
    const fromCell = ctx.cellAt(this.fromRef.vector);
    const toCell = ctx.cellAt(this.toRef.vector);
    const thing = fromCell?.take();

    if (thing) {
      toCell?.put(thing);
      agent.logs.push({
        tick: agent.mind.tick,
        message: `Moved [${thing.label}] from [${fromCell?.position.label}] to [${toCell?.position.label}].`,
      });
    }
    return new ActionSuccess();
  }
}

/** @category Actions */
export class RemoveAction extends Action {
  name = 'rm';
  cost = 0;
  ref: LiteralRef;

  constructor(ref: LiteralRef) {
    super();
    this.ref = ref;
  }

  perform(ctx: Area) {
    const fromCell = ctx.cellAt(this.ref.vector);
    const thing = fromCell?.take();

    if (thing) {
      ctx.remove(thing);
    }

    return new ActionSuccess();
  }
}

/** @category Actions */
export class SpawnAction extends Action {
  name = 'spawn';
  cost = 0;
  type: AgentType;
  constructor(type: AgentType) {
    super();
    this.type = type;
  }

  perform(ctx: Area, agent: Agent) {
    const spawned = new Agent(this.type);
    spawned.position.copy(agent.isLookingAt);
    if (!Area.bounds.contains(spawned.position)) {
      agent.logs.push({
        tick: agent.mind.tick,
        message: `[${spawned.position.label}] is out of bounds.`,
      });
      return new ActionFailure();
    }
    ctx.put(spawned);
    agent.logs.push({
      tick: agent.mind.tick,
      message: `Spawned a spirit at [${spawned.position.label}].`,
    });
    return new ActionSuccess();
  }
}

/** @category Actions */
export class SearchAction extends Action {
  name = 'search';
  cost = 0;
  str: string;
  constructor(str: string) {
    super();
    this.str = str;
  }

  perform(ctx: Area, agent: Agent) {
    const found = ctx.search(this.str).map((x) => `[${x.name}] at [${x.position.label}]`);
    agent.logs.push({
      tick: agent.mind.tick,
      message: `Found ${found ? `${found.join(', ')}.` : 'nothing.'}`,
    });

    return new ActionSuccess();
  }
}

export class SaveAction extends Action {
  name = 'save';
  cost = 0;

  perform(ctx: Area, agent: Agent) {
    agent.logs.push({
      tick: agent.mind.tick,
      message: 'Saving...',
    });

    return new ActionSuccess();
  }
}

export class CloneAction extends Action {
  name = 'clone';
  cost = 0;
  ref: LiteralRef;

  constructor(ref: LiteralRef) {
    super();
    this.ref = ref;
  }

  perform(ctx: Area, agent: Agent) {
    const cell = ctx.cellAt(this.ref.vector);

    if (!cell || !cell.slot) {
      agent.logs.push({
        tick: agent.mind.tick,
        message: `Nothing at [${this.ref.vector.label}].`,
      });
    } else {
      if (cell.slot.type instanceof AgentType) {
        const clone = new Agent(cell.slot.type);
        clone.position.copy(cell.slot.position).addX(1);
        ctx.put(clone, clone.position);
      }

      agent.logs.push({
        tick: agent.mind.tick,
        message: `Cloned [${cell.slot.label}].`,
      });
    }

    return new ActionSuccess();
  }
}

export class CreateAction extends Action {
  name = 'create';
  cost = 0;
  type: AgentType;

  constructor(type: string) {
    super();
    const TypeCtor = {

    }[type] || Wind;

    this.type = new TypeCtor();
  }

  perform(ctx: Area, agent: Agent) {
    const at = agent.position.add(agent.facing.direction.value);
    const cell = ctx.cellAt(at);

    if (!cell) {
      return new ActionFailure('The target cell is out of bounds.');
    }
    if (cell.slot) {
      return new ActionFailure('There is already somthing here.');
    }

    const created = new Agent(this.type);

    cell.put(created);

    return new ActionSuccess();
  }
}

/*
 * Terminal Actions
 * ====================
*/

/** @category Terminal Actions */
export class SwitchModeAction extends TerminalAction {
  name = 'switch-mode';
  cost = 0;
  perform() {
    this.terminal.switchModes();
    return new ActionSuccess();
  }
}

/** @category Terminal Actions */
export class MoveCursorAction extends TerminalAction {
  name = 'move-cursor';
  cost = 0;
  direction: Vector;
  constructor(terminal, direction: Vector) {
    super(terminal);
    this.direction = direction;
  }
  authorize() { return true; }
  perform(ctx: Area, agent: Agent) {
    if (agent.sees().contains(agent.cursorPosition.clone().add(this.direction))) {
      agent.cursorPosition.add(this.direction);
      const thing = ctx.cellAt(agent.cursorPosition)?.slot || null;
      agent.eyes = thing;
    }
    return new ActionSuccess();
  }
}

/** @category Terminal Actions */
export class MoveCursorToAction extends TerminalAction {
  name = 'move-cursor-to';
  cost = 0;
  destination: Vector;
  constructor(terminal, destination: Vector) {
    super(terminal);
    this.destination = destination;
  }
  authorize() { return true; }
  perform(ctx, agent: Agent) {
    const withinBounds = true;
    if (withinBounds) {
      agent.cursorPosition.copy(this.destination);
    }
    return new ActionSuccess();
  }
}

/** @category Terminal Actions */
export class SelectCellAction extends TerminalAction {
  name = 'select-cell';
  cost = 0;
  authorize() { return true; }
  perform(ctx, agent: Agent) {
    this.terminal.switchModes();
    const expr = `${agent.cursorPosition.x} ${agent.cursorPosition.y} ref`;
    this.terminal.lineEditor.line = expr;
    this.terminal.state.line = expr;
    this.terminal.handleTerminalInput(Keys.ENTER);
    this.terminal.switchModes();
    return new ActionSuccess();
  }
}

/** @category Terminal Actions */
export class PrintCursorModeHelpAction extends TerminalAction {
  name = 'print-cursor-mode-help';
  cost = 0;
  authorize() { return true; }
  perform() {
    this.terminal.write(`${CursorModeHelpText.join('\n')}\n`);
    return new ActionSuccess();
  }
}
