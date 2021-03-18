import * as uuid from 'uuid';
import { Stack } from '../../../lib/stack';
import { Vector, getRandomDirection } from '../../../lib/math';
import { Look, looks } from '../visuals/looks';
import { Item } from '../things/items';
import { Spell } from '../magic/spells';
import { Health, Stamina, Mana, Wealth } from './stats';
import { Job, NoviceJob } from './jobs';
import { Command, Move } from './commands';
import { Room } from '../world/rooms';
import Engine from '../engine';
import { debug } from '../../../lib/logging';

abstract class Capability {
  abstract bootstrap (agent: Agent): void
}

export abstract class Being {
  id: string = uuid.v4()

  position: Vector = new Vector()
  velocity: Vector = new Vector()

  health: Health = new Health()
  stamina: Stamina = new Stamina()
  mana: Mana = new Mana()
  wealth: Wealth = new Wealth()

  get nextPosition() {
    return new Vector(
      Math.min(Math.max(0, this.position.x + this.velocity.x), 15),
      Math.min(Math.max(0, this.position.y + this.velocity.y), 9),
    );
  }
}

export class AgentModel {
  room: Room

  constructor(engine: Engine) {
    this.room = new Proxy(engine.rooms[0], {});
  }
}

export abstract class Agent extends Being {
  capabilities: Array<Capability>

  look: Look
  job: Job

  name: string
  model: AgentModel

  spells: Array<Spell> = []

  queue: Array<Command> = []
  stack: Stack<Item> = new Stack()

  facing: Vector = new Vector(0, 1)
  dragging: Item | null = null
  items: Array<Item> = []

  constructor(engine: Engine, capabilities: Array<Capability> = []) {
    super();
    this.model = new AgentModel(engine);
    this.capabilities = capabilities;

    capabilities.forEach((cap) => cap.bootstrap(this));
  }

  takeTurn() {
    return this.queue.shift();
  }

  drag(direction: Vector, item: Item|null) {
    this.facing = direction;
    this.dragging = item;
  }
}

export abstract class Npc extends Agent {
  job = new NoviceJob()
  look = looks.npc
  spells: Array<Spell> = []

  health: Health = new Health()
  stamina: Stamina = new Stamina()
  mana: Mana = new Mana()
  wealth: Wealth = new Wealth()
}

export class RandomWalkCapability extends Capability {
  delayMs: number
  timer: NodeJS.Timeout

  constructor(delayMs: number = 1000) {
    super();
    this.delayMs = delayMs;
  }

  bootstrap(agent: Agent) {
    debug('bootstrap random walk');
    this.timer = setInterval(() => {
      const direction = getRandomDirection();

      agent.queue.push(
        new Move(direction.x, direction.y),
      );
    }, this.delayMs);
  }
}

export class Critter extends Agent {
  constructor(engine) {
    super(engine, [
      new RandomWalkCapability(),
    ]);
  }
}

export class Player extends Agent {
  constructor(engine: Engine, name: string, job: Job) {
    super(engine, []);

    this.name = name;
    this.job = job;
    this.look = job.look;
  }
}

export class Sheep extends Critter {
  name = 'Sheep'
  look = new Look('critter', '🐑', 'it\'s just a sheep, meeeeeeh')
}

export class Tutor extends Npc {
  name = 'Tutor'
  constructor(engine) {
    super(engine, []);
  }
}

export class Farmer extends Npc {
  name = 'farmer'
  look = looks.farmer
}
