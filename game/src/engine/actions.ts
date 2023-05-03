import {
  AREA_HEIGHT, AREA_WIDTH, Rectangle, Vector,
} from '../shared';
import {
  LiteralList,
  LiteralRef, LiteralString, LiteralVector, Operator, Quotation,
} from '../interpreter';
import { PathFinder } from './pathfinding';
import { LocationAddress, World } from './world';
import { Area } from './area';
import { Agent, Foe, Hero } from './agent';
import { Engine } from './engine';
import { Cell, Glyph } from './cell';
import { Thing } from './thing';
import words from './words';
import { LevelSelectScreen } from '../ui/views/level-select-screen';
import { ThingTypeName } from './things';
import { LoadScreen } from '../ui/views/load-screen';

export type ValidActions = (
  'save' | 'load' |
  'noop' |
  'right' | 'left' |
  'face' | 'step' | 'backstep' |
  'ls' | 'look' |
  'get' | 'put' | 'mv' | 'rm' |
  'exec' | 'create' |
  'tell' | 'halt' |
  'prop' | 'that' | 'me' | 'define' | 'clear' | 'xy' | 'facing' | 'del' | 'puts' |
  'say' | 'hi' | 'talk' | 'read' | 'claim' | 'scratch' | 'erase' | 'path' |
  'wait' | 'area' | 'zone' | 'exit' | 'link' | 'world' | 'zone_at' | 'area_at'
)

export type SerializableType = boolean | number | string

export type ActionArguments = Record<string, SerializableType>

export type HistoryEventState = Record<string, SerializableType | Record<string, SerializableType>>

export interface IActionContext {
  world: World
  area: Area
  agent: Agent
  engine: Engine
}

export interface IActionResult {
  status: 'success' | 'failure'
  message: string
  state?: HistoryEventState
}

export interface IActionDefinition<
  T extends ActionArguments = ActionArguments,
  Z extends HistoryEventState = HistoryEventState
> {
  cost: number
  perform(ctx: IActionContext, arg: T): IActionResult
  undo(ctx: IActionContext, arg: T, previousState: Z): IActionResult
}

const undoNoop = () => succeed('');

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
  undo: undoNoop,
};

export const load: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ engine }) {
    engine.load();
    return succeed('');
  },
  undo: undoNoop,
};

export const noop: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform() {
    return succeed('');
  },
  undo: undoNoop,
};

export const right: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ agent, area, engine }) {
    agent.facing.direction.rotateRight();
    agent.facing.cell = area.cellAt(agent.isLookingAt);

    engine.events.emit('sound:rotate');
    return succeed('');
  },
  undo({ agent, area }) {
    agent.facing.direction.rotateLeft();
    agent.facing.cell = area.cellAt(agent.isLookingAt);
    return succeed('');
  },
};

export const left: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ agent, area, engine }) {
    agent.facing.direction.rotateLeft();
    agent.facing.cell = area.cellAt(agent.isLookingAt);

    engine.events.emit('sound:rotate');
    return succeed('');
  },
  undo({ agent, area }) {
    agent.facing.direction.rotateRight();
    agent.facing.cell = area.cellAt(agent.isLookingAt);
    return succeed('');
  },
};

export const face: IActionDefinition<
  { x: number, y: number },
  { direction: { x: number, y: number } }> = {
    cost: 0,
    perform({ agent, area }, { x, y }) {
      const direction = new Vector(x, y);
      const previousDirection = agent.facing.direction.value;

      agent.facing.direction.rotateUntil(direction);
      agent.facing.cell = area.cellAt(
        agent.position.clone().add(agent.facing.direction.value),
      );

      return succeed('', {
        previousDirection: previousDirection.toObject(),
      });
    },
    undo({ agent, area }, _, previousState) {
      const previousDirection = Vector.from(previousState.direction);
      agent.facing.direction.rotateUntil(previousDirection);
      agent.facing.cell = area.cellAt(
        agent.position.clone().add(agent.facing.direction.value),
      );

      return succeed('');
    },
  };

export const step: IActionDefinition<
  ActionArguments,
  {
    position: { x: number, y: number }
    areaId?: number
  }
> = {
  cost: 0,
  perform({
    agent, area, world, engine,
  }) {
    const target = area.cellAt(agent.isLookingAt);
    const previousPosition = agent.position.clone();

    // Collision with the edge of the area
    if (!target) {
      const { direction } = agent.facing;
      const nextAreaPosition = area.position.clone().add(direction.value);
      const nextArea = [...world.activeZone.areas]
        .find((a) => a.position.equals(nextAreaPosition));

      // If there is an adjacent area
      if (nextArea) {
        const nextPosition = agent.position.clone();
        if (direction.value.x === 1) nextPosition.setX(0);
        if (direction.value.x === -1) nextPosition.setX(15);
        if (direction.value.y === 1) nextPosition.setY(0);
        if (direction.value.y === -1) nextPosition.setY(9);
        if (nextArea.cellAt(nextPosition)?.slot) {
          if (engine.hero.id === agent.id) {
            engine.events.emit('sound:fail');
          }
          return fail('There is something blocking the way.');
        }

        engine.tty.transition(nextArea, nextPosition);

        return succeed('', {
          position: previousPosition.toObject(),
          areaId: area.id,
        });
      }
    }

    // Hero collides with enemy
    if (target?.slot instanceof Agent && target.slot.type instanceof Foe) {
      agent.hp.decrease(1);
      if (agent.hp.value === 0) {
        // TODO: Handle death of agent
      } else {
        agent.velocity.sub(agent.facing.direction.value);
      }
      return fail('');
    }

    // Enemy collides with hero
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

        engine.events.emit('sound:step');

        return succeed('', {
          position: previousPosition.toObject(),
        });
      }
    }

    // Normal case, just a step
    if (target && (!target.isBlocked)) {
      area.cellAt(agent.position)?.take();
      target.put(agent);
      agent.position.add(agent.facing.direction.value);
      agent.facing.cell = area.cellAt(agent.isLookingAt);

      engine.events.emit('sound:step');

      return succeed('', {
        position: previousPosition.toObject(),
      });
    }

    // Step through a door
    if (target?.slot?.type.name === 'door') {
      const next = area.cellAt(target.position.clone().add(agent.facing.direction.value));
      if (next && (!next.slot || !next.slot.type.isBlocking)) {
        console.log('its a door and theres a free cell after');
        area.cellAt(agent.position)?.take();
        next.put(agent);
        agent.position.add(agent.facing.direction.value);
        agent.position.add(agent.facing.direction.value);
        agent.facing.cell = area.cellAt(agent.isLookingAt);

        engine.events.emit('sound:step');

        return succeed('', {
          position: previousPosition.toObject(),
        });
      }
    }

    if (engine.hero.id === agent.id) {
      engine.events.emit('sound:fail');
    }

    return fail('');
  },
  undo({ agent, area, engine }, _, previousState) {
    console.log('previousState:', previousState);
    const previousPosition = agent.position.clone();
    const targetPosition = Vector.from(previousState.position);
    const targetArea = engine.entities.areaList
      .find((a) => a.id === previousState.areaId) || area;

    if (previousState.areaId !== undefined) {
      area.remove(agent);
      agent.area = targetArea;
    }

    area.cellAt(previousPosition)?.take();
    targetArea.put(agent, targetPosition);
    agent.position.copy(targetPosition);

    return succeed('');
  },
};

export const backstep: IActionDefinition<
  ActionArguments,
  {
    position: { x: number, y: number }
    areaId?: number
  }
> = {
  cost: 0,
  perform({ agent, area, engine }) {
    const previousPosition = agent.position.clone();
    const oppositeDirection = agent.facing.direction.clone().rotateRight().rotateRight();
    const target = area.cellAt(agent.position.clone().add(oppositeDirection.value));

    // Collision with the edge of the area
    if (!target) {
      const nextAreaPosition = area.position.clone().add(oppositeDirection.value);
      const nextArea = engine.entities.areaList.find((a) => a.position.equals(nextAreaPosition));

      // If there is an adjacent area
      if (nextArea) {
        const nextPosition = agent.position.clone();
        if (oppositeDirection.value.x === 1) nextPosition.setX(0);
        if (oppositeDirection.value.x === -1) nextPosition.setX(15);
        if (oppositeDirection.value.y === 1) nextPosition.setY(0);
        if (oppositeDirection.value.y === -1) nextPosition.setY(9);
        if (nextArea.cellAt(nextPosition)?.slot) {
          if (engine.hero.id === agent.id) {
            engine.events.emit('sound:fail');
          }
          return fail('There is something blocking the way.');
        }
        area.remove(agent);
        agent.position.copy(nextPosition);
        nextArea.put(agent);
        agent.area = nextArea;

        return succeed('', {
          position: previousPosition.toObject(),
          areaId: area.id,
        });
      }
    }

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
        return succeed('', {
          position: previousPosition.toObject(),
        });
      }
    }

    if (target && (!target.isBlocked)) {
      area.cellAt(agent.position)?.take();
      target.put(agent);
      agent.position.sub(agent.facing.direction.value);
      agent.facing.cell = area.cellAt(agent.isLookingAt);
      return succeed('', {
        position: previousPosition.toObject(),
      });
    }

    if (engine.hero.id === agent.id) {
      engine.events.emit('sound:fail');
    }

    return fail('');
  },
  undo({ agent, area, engine }, _, previousState) {
    const previousPosition = agent.position.clone();
    const targetPosition = Vector.from(previousState.position);
    const targetArea = engine.entities.areaList.find((a) => a.id === previousState.areaId) || area;

    if (previousState.areaId !== undefined) {
      area.remove(agent);
    }

    area.cellAt(previousPosition)?.take();
    targetArea.put(agent, targetPosition);
    agent.position.copy(targetPosition);

    return succeed('');
  },
};

// export const goto: IActionDefinition<{ x: number, y: number }> = {
//   cost: 0,
//   perform({ area, agent }, { x, y }) {
//     const pathfinder = new PathFinder(x, y);

//     if (agent.position.equals(pathfinder.destination)) {
//       return fail('Already here.');
//     }

//     const path = pathfinder.findPath(area, agent);

//     if (!path.length) return fail('Could not find a path.');

//     const actions = pathfinder.buildPathActions(agent, path.reverse());

//     // actions.forEach((action) => agent.schedule(action));

//     agent.mind.interpreter.exec(actions, () => {
//       console.log('goto: done!!!');
//     });

//     return succeed('Found a path to the destination cell.');
//   },
//   undo: undoNoop,
// };

export const path: IActionDefinition<{ fromX: number, fromY: number, toX: number, toY: number }> = {
  cost: 0,
  perform({ area, agent }, {
    fromX, fromY, toX, toY,
  }) {
    const from = new Vector(fromX, fromY);
    const pathfinder = new PathFinder(toX, toY);

    if (from.equals(pathfinder.destination)) {
      return fail('Already here.');
    }

    const p = pathfinder.findPath(area, from).reverse();

    if (!p.length) return fail('Could not find a path.');

    agent.mind.stack.push(Quotation.from(p.map((c) => new LiteralVector(c.position.clone()))));

    return succeed('Found a path to the destination cell.');
  },
  undo({ agent }) {
    agent.mind.stack.pop();
    return succeed('');
  },
};

export const ls: IActionDefinition<{}> = {
  cost: 0,
  perform({ area, agent }) {
    const agents = area.list();
    const refs = agents.map((a) => new LiteralRef(a.id));

    agent.mind.interpreter.sysret(new LiteralList(refs));

    return succeed(`Found ${refs.length} things.`);
  },
  undo({ agent }) {
    agent.mind.stack.pop();
    return succeed('');
  },
};

export const look: IActionDefinition<{ x: number, y: number }> = {
  cost: 0,
  perform({ area }, { x, y }) {
    const vector = new Vector(x, y);
    const cell = area.cellAt(vector);
    const seen = cell?.slot;

    return seen
      ? succeed(seen.label)
      : fail('Nothing here.');
  },
  undo: undoNoop,
};

export const get: IActionDefinition<{}> = {
  cost: 0,
  perform({ agent }) {
    if (!agent.facing.cell || !agent.facing.cell.slot) {
      return fail('There\'s nothing here.');
    }

    if (agent.hand && agent.inventory.length >= 3) {
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

    if (agent.hand) {
      agent.inventory.push(agent.hand);
    }

    const thing = agent.get() as Thing;

    return succeed(`You get the ${thing.name}.`);
  },
  undo({ agent }) {
    agent.drop();

    return succeed('');
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
  undo({ agent }) {
    agent.get();

    return succeed('');
  },
};

export const mv: IActionDefinition<{ fromX: number, fromY: number, toX: number, toY: number }> = {
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
  undo: undoNoop,
};

export const rm: IActionDefinition<{ id: number }> = {
  cost: 0,
  perform({ agent, area }, { id }) {
    const body = area.findBodyById(id);

    if (body && !(body instanceof Cell)) {
      if (body.id === agent.id) {
        agent.mind.interpreter.sysret(new LiteralRef(0));
        return fail('Cannot remove self.');
      }

      const cell = area.cellAt(body.position) as Cell;
      area.remove(body);
      agent.mind.interpreter.sysret(new LiteralRef(cell.id));
      return succeed(`Removed ${body.name}.`);
    }

    return fail('Nothing here.');
  },
  undo: undoNoop,
};

export const exec: IActionDefinition<{ text: string }> = {
  cost: 0,
  perform({ agent }, { text }) {
    try {
      const term = agent.mind.compiler.compile(text);

      agent.mind.interpreter.update(term);

      return succeed('');
    } catch (err) {
      return fail((err as Error).message);
    }
  },
  undo({ engine }, { text }) {
    engine.tty.send(text);
    return succeed('');
  },
};

export const create: IActionDefinition<{ thingName: ThingTypeName, x: number, y: number }> = {
  cost: 0,
  perform({
    engine, world, area, agent,
  }, { thingName, x, y }) {
    const position = new Vector(x, y);

    try {
      if (thingName === 'world') {
        const newWorld = engine.entities.createWorld();
        agent.mind.interpreter.sysret(new LiteralRef(newWorld.id));
      } else if (thingName === 'zone') {
        const newZone = world.createZone(position);
        agent.mind.interpreter.sysret(new LiteralRef(newZone.id));
      } else if (thingName === 'area') {
        const newArea = world.activeZone.createArea(position);
        agent.mind.interpreter.sysret(new LiteralRef(newArea.id));
      } else {
        const thing = area.create(thingName, position);
        agent.mind.interpreter.sysret(new LiteralRef(thing.id));
      }

      return succeed(`Created a ${thingName} at ${position.label}.`);
    } catch (err) {
      agent.mind.interpreter.sysret(new LiteralRef(0));
      return fail(`Can't create a '${thingName}': ${(err as Error).message}`);
    }
  },
  undo: undoNoop,
};

export const tell: IActionDefinition<{ agentId: number, message: string }> = {
  cost: 0,
  perform({ area }, { agentId, message }) {
    const targetAgent = area.findAgentById(agentId);

    if (!targetAgent) {
      return fail(`Could not find an agent with id ${agentId}`);
    }

    targetAgent.mind.queue.add({
      name: 'exec',
      args: {
        text: message,
      },
    });

    return succeed(`Told ${targetAgent.type.name} (&${targetAgent.id.toString(16)}): [${message}].`);
  },
  undo: undoNoop,
};

export const halt: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ agent }) {
    agent.halt();
    return succeed('Halted.');
  },
  undo: undoNoop,
};

export const prop: IActionDefinition<{ id: number, propName: string }> = {
  cost: 0,
  perform({ agent, engine }, { id, propName }) {
    const target = engine.findEntityById(id);

    if (!target) {
      return fail(`Cannot find &${id}`);
    }

    const props = {
      id: (body) => new LiteralRef(body.id),
      name: (body) => new LiteralString(body.name || body.id),
      xy: (body) => new LiteralVector(body.position),
      type: (body) => new LiteralString(body.type?.name),
    };

    const fn = props[propName];

    const propValue = fn
      ? fn(target)
      : undefined;

    if (typeof propValue === 'undefined') {
      return fail(`Cannot find prop ${propName} on &${id}`);
    }

    agent.mind.interpreter.sysret(propValue);

    return succeed('');
  },
  undo: undoNoop,
};

export const that: IActionDefinition<{ x: number, y: number }> = {
  cost: 0,
  perform({ agent, area }, { x, y }) {
    const cell = area.cellAt(new Vector(x, y));

    if (!cell) {
      agent.mind.interpreter.sysret(new LiteralRef(0));
      return fail('');
    }

    if (!cell.slot) {
      agent.mind.interpreter.sysret(new LiteralRef(cell.id));
      return succeed('');
    }

    agent.mind.interpreter.sysret(new LiteralRef(cell.slot.id));

    return succeed('');
  },
  undo: undoNoop,
};

export const zoneAt: IActionDefinition<{ x: number, y: number }> = {
  cost: 0,
  perform({ agent, world }, { x, y }) {
    const zone = world.findZoneAt(new Vector(x, y));

    if (!zone) {
      agent.mind.interpreter.sysret(new LiteralRef(0));
      return fail('');
    }

    agent.mind.interpreter.sysret(new LiteralRef(zone.id));

    return succeed('');
  },
  undo: undoNoop,
};

export const me: IActionDefinition<{ id: number }> = {
  cost: 0,
  perform({ agent }) {
    agent.mind.interpreter.sysret(new LiteralRef(agent.id));

    return succeed('');
  },
  undo: undoNoop,
};

export const define: IActionDefinition<{ name: string, program: string }> = {
  cost: 0,
  perform({ agent }, { name, program }) {
    if (agent.mind.compiler.dict[name]) {
      return fail(`The word '${name}' already exists.`);
    }

    agent.mind.compiler.dict[name] = new Operator([name], [], () => {
      const compiled = agent.mind.compiler.compile(program);
      console.log('compiled:', compiled);
      agent.mind.interpreter.term.unshift(...compiled);
    });

    return succeed(`Defined [${program}] as '${name}'`);
  },
  undo: undoNoop,
};

export const clear: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ agent }) {
    const { tick } = agent.mind;

    agent.mind.stack.popN(agent.mind.stack.length);
    agent.logs = new Array(7).fill(0).map(() => ({
      tick,
      message: ' ',
    }));

    agent.mind.interpreter.sysret();

    return succeed('');
  },
  undo: undoNoop,
};

export const xy: IActionDefinition<{ refId: number }> = {
  cost: 0,
  perform({ agent, world, area }, { refId }) {
    if (refId > 0 && refId <= 160) {
      const cell = area.findCellById(refId) as Cell;
      agent.mind.interpreter.sysret(new LiteralVector(cell.position));
      return succeed('');
    }

    const referenced = world.findEntityById(refId);
    if (referenced) {
      if (referenced instanceof World) {
        return fail('Worlds don\'t have a position property.');
      }
      agent.mind.interpreter.sysret(new LiteralVector(referenced.position));
      return succeed('');
    }
    return fail(`There is no entity with ref id ${refId}`);
  },
  undo: undoNoop,
};

export const facing: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ agent }) {
    agent.mind.interpreter.sysret(
      new LiteralVector(agent.facing.direction.value),
    );

    return succeed('');
  },
  undo: undoNoop,
};

export const del: IActionDefinition<{ word: string }> = {
  cost: 0,
  perform({ agent }, { word }) {
    if (agent.mind.compiler.dict[word]) {
      delete agent.mind.compiler.dict[word];
      return succeed(`Deleted the word '${word}'`);
    }
    return fail(`Word '${word}' does not exist`);
  },
  undo: undoNoop,
};

export const puts: IActionDefinition<{ message: string }> = {
  cost: 0,
  perform(_, { message }) {
    return succeed(message);
  },
  undo: undoNoop,
};

export const say: IActionDefinition<{ message: string }> = {
  cost: 0,
  perform({ area }, { message }) {
    [...area.agents].forEach((a) => {
      message.split('\n').forEach((m) => {
        a.logs.push({
          message: m,
          tick: a.mind.tick,
        });
      });
    });

    return succeed('');
  },
  undo: undoNoop,
};

export const hi: IActionDefinition<{ agentId: number }> = {
  cost: 0,
  perform({ area, engine }, { agentId }) {
    const target = area.findAgentById(agentId);

    if (target) {
      while (engine.story.canContinue) {
        const message = engine.story.Continue() || '';
        target.mind.queue.add({
          name: 'say',
          args: {
            message,
          },
        });
      }

      if (engine.story.currentChoices.length) {
        target.mind.queue.add({
          name: 'say',
          args: {
            message: engine.story.currentChoices.map((c) => `${c.index}) ${c.text}`).join('\n'),
          },
        });
      }

      return succeed('');
    }

    return fail(`No agent with id ${agentId}`);
  },
  undo: undoNoop,
};

export const talk: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ agent, area, engine }) {
    const targetId = agent.facing.cell?.slot?.id;
    if (targetId) {
      const target = area.findAgentById(targetId);

      if (target) {
        engine.story.BindExternalFunction('exec', (code: string) => {
          console.log('executing:', code);
        });
        engine.story.ChoosePathString('intro');
        if (engine.story.canContinue) {
          engine.story.Continue();
          engine.tty.talking = true;
        } else {
          return fail('');
        }

        return succeed('');
      }
    }

    return fail('There is no one here to talk to.');
  },
  undo: undoNoop,
};

export const read: IActionDefinition<ActionArguments> = {
  cost: 0,
  perform({ agent, engine }) {
    const thing = agent.hand;
    if (thing) {
      engine.story.ChoosePathString('example_book');
      if (engine.story.canContinue) {
        engine.story.Continue();
        engine.tty.talking = true;
      } else {
        return fail('Could not find content for this book.');
      }

      return succeed('');
    }

    return fail('You are not holding a book.');
  },
  undo: undoNoop,
};

export const claim: IActionDefinition<{ x: number, y: number, w: number, h: number }> = {
  cost: 0,
  perform() {
    return fail('Not implemented.');
  },
  undo: undoNoop,
};

export const scratch: IActionDefinition<{ n: number }> = {
  cost: 0,
  perform({ agent }, { n }) {
    const { cell } = agent.facing;

    if (!cell) {
      return fail('There is no cell here.');
    }

    cell.scratch(n);

    agent.mind.stack.push(new LiteralRef(cell.id));

    return succeed(`Scratched ${n} at ${cell.position.label}`);
  },
  undo: undoNoop,
};

export const erase: IActionDefinition<{}> = {
  cost: 0,
  perform({ agent }) {
    const { cell } = agent.facing;

    if (!cell) {
      return fail('There is no cell here.');
    }

    cell.erase();

    agent.mind.stack.push(new LiteralRef(cell.id));

    return succeed(`Erased ${cell.position.label}`);
  },
  undo: undoNoop,
};

export const wait: IActionDefinition<{}> = {
  cost: 0,
  perform({ agent, engine }) {
    agent.waiting = true;

    engine.tty.switchModes();

    agent.mind.queue.add({ name: 'noop' });

    return succeed('Waiting. Press <CMD> + <C> to stop.');
  },
  undo: undoNoop,
};

export const area: IActionDefinition<
  { x: number, y: number },
  { previousAreaX: number, previousAreaY: number }
> = {
  cost: 0,
  perform(ctx, { x, y }) {
    const previous = ctx.area.position.clone();
    const next = new Vector(x, y);
    const zone = ctx.world.activeZone;
    try {
      zone.setActiveArea(next);
      return succeed(`Now in area ${next.label}.`, {
        previousAreaX: previous.x,
        previousAreaY: previous.y,
      });
    } catch (err) {
      return fail((err as Error).message);
    }
  },
  undo(ctx, _, { previousAreaX, previousAreaY }) {
    ctx.world.activeZone.setActiveArea(new Vector(previousAreaX, previousAreaY));

    return succeed('');
  },
};

export const zone: IActionDefinition<
  { x: number, y: number },
  { previousZoneX: number, previousZoneY: number }
> = {
  cost: 0,
  perform({ world }, { x, y }) {
    const previous = world.activeZone.position.clone();
    const next = new Vector(x, y);
    try {
      world.setActiveZone(next);
      return succeed(`Now in zone ${next.label}.`, {
        previousZoneX: previous.x,
        previousZoneY: previous.y,
      });
    } catch (err) {
      return fail((err as Error).message);
    }
  },
  undo(ctx, _, { previousZoneX, previousZoneY }) {
    ctx.world.activeZone.setActiveArea(new Vector(previousZoneX, previousZoneY));

    return succeed('');
  },
};

function isAtBoundary(v: Vector) {
  return (v.x === 0 || v.x === AREA_WIDTH - 1 || v.y === 0 || v.y === AREA_HEIGHT - 1);
}

export const exit: IActionDefinition<
  {},
  { previousZoneX: number, previousZoneY: number }
> = {
  cost: 0,
  perform({ engine, agent }) {
    // If there is no adjacent area, exit the level
    if (engine.hero.id === agent.id) {
      if (!isAtBoundary(agent.position)) {
        return fail('You can only exit an area from its boundaries.');
      }
      engine.tty.clear();
      engine.tty.view = new LoadScreen();
      const term = agent.mind.compiler.compile('');
      agent.mind.interpreter.exec(term, () => {
        engine.tty.view = new LevelSelectScreen();
        engine.tty.clear();
        engine.tty.render();
      });

      return succeed('');
    }

    return fail('');
  },
  undo: undoNoop,
};

export const actions: Record<ValidActions, IActionDefinition<any>> = {
  save,
  load,
  noop,
  right,
  left,
  face,
  step,
  backstep,
  // goto,
  path,
  ls,
  look,
  get,
  put,
  mv,
  rm,
  exec,
  create,
  tell,
  halt,
  prop,
  that,
  me,
  define,
  clear,
  xy,
  facing,
  del,
  puts,
  say,
  hi,
  talk,
  read,
  claim,
  scratch,
  erase,
  wait,
  area,
  zone,
  exit,
  zone_at: zoneAt,
};

export function succeed(msg: string, state?: HistoryEventState): IActionResult {
  return {
    status: 'success',
    message: msg,
    state,
  };
}

export function fail(msg: string): IActionResult {
  return {
    status: 'failure',
    message: msg,
  };
}
