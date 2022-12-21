import { Vector } from '../shared';
import {
  LiteralRef, LiteralString, Operator, Quotation,
} from '../interpreter';
import { PathFinder } from './pathfinding';
import { Crown, Flag } from './things';
import { AgentTypeName, ThingTypeName, World } from './world';
import { Area } from './area';
import { Agent, Foe, Hero } from './agent';
import { Engine } from './engine';
import { Glyph } from './cell';
import { Thing } from './thing';

export type ValidActions = (
  'save' | 'load' |
  'noop' | 'wait' |
  'right' | 'left' |
  'face' | 'step' | 'backstep' | 'goto' |
  'ls' | 'look' |
  'get' | 'put' | 'mv' | 'rm' |
  'exec' | 'create' | 'spawn' |
  'tell' | 'halt' |
  'prop' | 'point' | 'me' | 'define'
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

export const save: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ engine }) {
    engine.save();
    return succeed('');
  },
};

export const load: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ engine }) {
    engine.load();
    return succeed('');
  },
};

export const noop: IActionDefinition<ActionArguments> = {
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

export const right: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ agent, area }) {
    agent.facing.direction.rotateRight();
    agent.facing.cell = area.cellAt(agent.isLookingAt);
    return succeed('');
  },
};

export const left: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ agent, area }) {
    agent.facing.direction.rotateLeft();
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

    if (agent.type instanceof Foe
      && target?.slot instanceof Agent
      && target.slot.type instanceof Hero) {
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

export const backstep: IActionDefinition<{}> = {
  cost: 0,
  perform({ agent, area }) {
    const oppositeDirection = agent.facing.direction.clone().rotateRight().rotateRight();
    const target = area.cellAt(agent.position.clone().add(oppositeDirection.value));

    if (target?.slot instanceof Agent && target.slot.type instanceof Foe) {
      agent.hp.decrease(1);
      if (agent.hp.value === 0) {
        // TODO: Handle death of agent
      } else {
        agent.velocity.sub(agent.facing.direction.value);
      }
      return fail('');
    }

    if (agent.type instanceof Foe
      && target?.slot instanceof Agent
      && target.slot.type instanceof Hero) {
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
      agent.position.sub(agent.facing.direction.value);
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
  perform({ area, agent }) {
    const agents = area.list();
    const msg = agents
      .map((x) => `&${x.id} ${x.type.name}`)
      .join(', ');

    const refs = agents.map((a) => new LiteralRef(a.id));

    agent.mind.sysret(new Quotation(refs));

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

    if (agent.facing.cell.slot instanceof Agent
       || (agent.facing.cell.slot instanceof Thing && agent.facing.cell.slot.type.isStatic)) {
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
  perform({ area }, {
    fromX, fromY, toX, toY,
  }) {
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

export const rm: IActionDefinition<{ id: number }> = {
  cost: 0,
  perform({ agent, area }, { id }) {
    const body = area.findBodyById(id);

    if (body) {
      if (body.id === agent.id) {
        return fail('Cannot remove self.');
      }
      area.remove(body);
      return succeed(`Removed ${body.name}.`);
    }

    return fail('Nothing here.');
  },
};

export const exec: IActionDefinition<{ text: string }> = {
  cost: 0,
  perform({ agent }, { text }) {
    agent.mind.interpret(text);

    return succeed(`Executing '${text}'`);
  },
};

export const create: IActionDefinition<{ thingName: ThingTypeName }> = {
  cost: 0,
  perform({ world, area, agent }, { thingName }) {
    try {
      const thing = world.create(thingName, area, agent.cursorPosition);
      return succeed(`Created a ${thingName} at ${thing.position.label}`);
    } catch (err) {
      return fail(`Can't create a '${thingName}'`);
    }
  },
};

export const spawn: IActionDefinition<{ agentName: AgentTypeName }> = {
  cost: 0,
  perform({ world, area, agent }, { agentName }) {
    if (area.cellAt(agent.cursorPosition)?.slot) return fail('There is already something here');
    try {
      const newAgent = world.spawn(agentName, area, agent.cursorPosition);
      return succeed(`Created a ${agentName} at ${newAgent.position.label}`);
    } catch (err) {
      return fail(`Can't spawn a '${agentName}'`);
    }
  },
};

export const tell: IActionDefinition<{ agentId: number, message: string }> = {
  cost: 0,
  perform({ area }, { agentId, message }) {
    const targetAgent = area.findAgentById(agentId);

    if (!targetAgent) {
      return fail(`Could not find an agent with id ${agentId}`);
    }

    console.log('message:', message);

    targetAgent.mind.queue.add({
      name: 'exec',
      args: {
        text: message,
      },
    });

    return succeed(`Told ${targetAgent.type.name} #${targetAgent.id}: "${message}".`);
  },
};

export const halt: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ agent }) {
    agent.halt();
    return succeed('Halted.');
  },
};

export const prop: IActionDefinition<{ id: number, propName: string }> = {
  cost: 0,
  perform({ agent, area }, { id, propName }) {
    const target = area.findBodyById(id);

    if (!target) {
      return fail(`Cannot find &${id}`);
    }

    const propValue = target[propName];

    if (typeof propValue === 'undefined') {
      return fail(`Cannot find prop ${propName} on &${id} (${target.type.name})`);
    }

    const litStr = new LiteralString(String(propValue));

    agent.mind.sysret(litStr);

    return succeed('');
  },
};

export const point: IActionDefinition<{ x: number, y: number }> = {
  cost: 0,
  perform({ agent, area }, { x, y }) {
    const cell = area.cellAt(new Vector(x, y));

    if (!cell || !cell.slot) {
      agent.mind.sysret(new LiteralRef(0));
      return fail('');
    }

    agent.mind.sysret(new LiteralRef(cell.slot.id));

    return succeed('');
  },
};

export const me: IActionDefinition<{ id: number }> = {
  cost: 0,
  perform({ agent }) {
    agent.mind.sysret(new LiteralRef(agent.id));

    return succeed('');
  },
};

export const define: IActionDefinition<{ name: string, program: string}> = {
  cost: 0,
  perform({ agent }, { name, program }) {
    if (agent.dict[name]) {
      return fail(`The word '${name}' already exists.`);
    }

    agent.dict[name] = new Operator([name], [], (that) => {
      that.exec(agent.mind.compile(program));
    });

    return succeed('');
  },
};

export const actions: Record<ValidActions, IActionDefinition<any>> = {
  save,
  load,
  noop,
  wait,
  right,
  left,
  face,
  step,
  backstep,
  goto,
  ls,
  look,
  get,
  put,
  mv,
  rm,
  exec,
  create,
  spawn,
  tell,
  halt,
  prop,
  point,
  me,
  define,
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
