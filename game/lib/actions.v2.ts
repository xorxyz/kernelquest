import { Interpretation } from 'xor4-interpreter';
import { debug, Vector } from 'xor4-lib';
import { Agent, Area, Engine, Foe, Glyph, Hero, Thing, World } from '../src';
import { Bug } from './agents';
import { PathFinder } from './pathfinding';
import { Crown, Flag } from './things';

export type ValidActions = (
  'save' | 'load' |
  'noop' | 'wait' |
  'rotate' | 'face' | 'step' | 'goto' |
  'ls' | 'look' |
  'get' | 'put' | 'mv' | 'rm' |
  'exec' | 'create'
)

export type ActionArguments = Record<string, boolean | number | string>

export interface IActionContext {
  world: World
  area: Area
  agent: Agent
  engine: Engine
}

export interface IActionResult {
  status: 'success' | 'failure'
  message: string
}

export interface IActionDefinition<T extends ActionArguments> {
  cost: number
  perform (ctx: IActionContext, arg: T): IActionResult
}

export interface IAction {
  name: ValidActions
  args?: ActionArguments
}

export const save: IActionDefinition<{}> = {
  cost: 0,
  perform({ engine }) {
    engine.save();
    return succeed('');
  },
};

export const load: IActionDefinition<{}> = {
  cost: 0,
  perform({ engine }) {
    engine.load();
    return succeed('');
  },
};

export const noop: IActionDefinition<{}> = {
  cost: 0,
  perform() {
    return succeed('');
  },
};

export const wait: IActionDefinition<{ duration: number }> = {
  cost: 0,
  perform({ agent }, { duration }) {
    if (agent.isWaitingUntil !== null) {
      agent.isWaitingUntil += duration;
      return succeed('');
    }
    agent.isWaitingUntil = agent.mind.tick + duration;
    return succeed('');
  },
};

export const rotate: IActionDefinition<{}> = {
  cost: 0,
  perform({ agent, area }) {
    agent.facing.direction.rotate();
    agent.facing.cell = area.cellAt(agent.isLookingAt);
    return succeed('');
  },
};

export const face: IActionDefinition<{ x: number, y: number }> = {
  cost: 0,
  perform({ agent, area }, { x, y }) {
    const direction = new Vector(x, y);

    agent.facing.direction.rotateUntil(direction);
    agent.facing.cell = area.cellAt(
      agent.position.clone().add(agent.facing.direction.value),
    );

    return succeed('');
  },
};

export const step: IActionDefinition<{}> = {
  cost: 0,
  perform({ agent, area }) {
    const target = area.cellAt(agent.isLookingAt);

    if (target?.slot instanceof Agent && target.slot.type instanceof Foe) {
      agent.hp.decrease(1);
      if (agent.hp.value === 0) {
        // TODO: Handle death of agent
      } else {
        agent.velocity.sub(agent.facing.direction.value);
      }
      return fail('');
    }

    if (agent.type instanceof Foe &&
      target?.slot instanceof Agent &&
      target.slot.type instanceof Hero) {
      if (target.slot.isAlive) {
        target.slot.hp.decrease(1);
        if (target.slot.hp.value === 0) {
          target.slot.type.glyph = new Glyph('☠️ ');
        } else {
          target.slot.velocity.add(agent.facing.direction.value);
        }
        return succeed('');
      }
    }

    if (target && (!target.isBlocked)) {
      area.cellAt(agent.position)?.take();
      target.put(agent);
      agent.position.add(agent.facing.direction.value);
      agent.facing.cell = area.cellAt(agent.isLookingAt);
      return succeed('');
    }

    return fail('');
  },
};

export const goto: IActionDefinition<{ x: number, y: number }> = {
  cost: 0,
  perform({ area, agent }, { x, y }) {
    const pathfinder = new PathFinder(x, y);

    if (agent.position.equals(pathfinder.destination)) {
      return fail('Already here.');
    }

    const path = pathfinder.findPath(area, agent);

    if (!path.length) return fail('Could not find a path.');

    const actions = pathfinder.buildPathActions(agent, path.reverse());

    actions.forEach((action) => agent.schedule(action));

    return succeed('Found a path to the destination cell.');
  },
};

export const ls: IActionDefinition<{}> = {
  cost: 0,
  perform({ area }) {
    const msg = area.list()
      .map((x) => x.name + x.position.x + x.position.y)
      .join(', ');

    return succeed(msg);
  },
};

export const look: IActionDefinition<{ x:number, y: number}> = {
  cost: 0,
  perform({ area }, { x, y }) {
    const vector = new Vector(x, y);
    const cell = area.cellAt(vector);
    const seen = cell?.slot;

    return seen
      ? succeed(seen.label)
      : fail('Nothing here.');
  },
};

export const get: IActionDefinition<{}> = {
  cost: 0,
  perform({ agent, area }) {
    if (!agent.facing.cell || !agent.facing.cell.slot) {
      return fail('There\'s nothing here.');
    }

    if (agent.hand) {
      return fail('You hands are full.');
    }

    if (agent.facing.cell.slot instanceof Agent ||
       (agent.facing.cell.slot instanceof Thing && agent.facing.cell.slot.type.isStatic)) {
      return fail('You can\'t get this.');
    }

    if (agent.facing.cell && agent.facing.cell.containsFoe()) {
      agent.hp.decrease(1);
      return fail('');
    }

    const thing = agent.get();

    if (thing) {
      if (thing instanceof Thing) {
        thing.owner = agent;

        if (thing.type instanceof Crown) {
          area.capturedCrowns.add(thing);
        }

        if (thing.type instanceof Flag) {
          area.capturedFlags.add(thing);
        }
      }

      return succeed(`You get the ${thing.name}.`);
    }

    return fail('');
  },
};

export const put: IActionDefinition<{}> = {
  cost: 0,
  perform({ area, agent }) {
    if (!agent.hand) return fail('You are not holding anything.');

    const target = area.cellAt(agent.isLookingAt);

    return target && !target.isBlocked && agent.drop()
      ? succeed(`You put down the ${(target.slot as Thing).name}.`)
      : fail('There\'s already something here.');
  },
};

export const mv: IActionDefinition<{fromX: number, fromY: number, toX: number, toY: number}> = {
  cost: 0,
  perform({ area }, { fromX, fromY, toX, toY }) {
    const fromCell = area.cellAt(new Vector(fromX, fromY));
    const toCell = area.cellAt(new Vector(toX, toY));

    const thing = fromCell?.take();

    if (thing) {
      toCell?.put(thing);
      return succeed(
        `Moved [${thing.label}] from [${fromCell?.position.label}] to [${toCell?.position.label}].`,
      );
    }

    return fail('');
  },
};

export const rm: IActionDefinition<{ x: number, y: number }> = {
  cost: 0,
  perform({ area }, { x, y }) {
    const fromCell = area.cellAt(new Vector(x, y));
    const thing = fromCell?.take();

    if (thing) {
      area.remove(thing);
      return succeed(`Removed ${thing.name} from [${x} ${y}].`);
    }

    return fail('Nothing here.');
  },
};

export const exec: IActionDefinition<{ text: string }> = {
  cost: 0,
  perform({ agent }, { text }) {
    const result = agent.mind.interpret(text);

    if (result instanceof Error) {
      debug('result.message', result.message);
      return fail(result.message);
    } if (result instanceof Interpretation) {
      result.stack.map((factor) => factor.toString()).join(' ');

      return succeed('');
    }

    return fail('Unhandled Exception.');
  },
};

export const create: IActionDefinition<{ name: string }> = {
  cost: 0,
  perform({ world, agent, area }) {
    const bug = world.spawn('bug', area, agent.isLookingAt.clone());
    bug.name = 'bug';
    return succeed('');
  },
};

export const actions: Record<ValidActions, IActionDefinition<any>> = {
  save,
  load,
  noop,
  wait,
  rotate,
  face,
  step,
  goto,
  ls,
  look,
  get,
  put,
  mv,
  rm,
  exec,
  create,
};

export function succeed(msg: string): IActionResult {
  return {
    status: 'success',
    message: msg,
  };
}

export function fail(msg: string): IActionResult {
  return {
    status: 'failure',
    message: msg,
  };
}
