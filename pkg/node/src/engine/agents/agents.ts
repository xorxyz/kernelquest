/*
 * living entities are called actors
 */
import * as uuid from 'uuid';
import {
  Item,
  Weapon,
  Clothes,
  Relic,
} from '../things/items';
import {
  Health,
  Stamina,
  Mana,
  Wealth,
} from './stats';
import { Look, looks } from '../visuals/looks';
import {
  Job,
  CritterJob,
  NoviceJob,
} from './jobs';
import { Command, Move } from './commands';
import { Vector, getRandomDirection } from '../../../lib/math';
import { Stack } from '../../../lib/stack';
import {
  Heal, Teleport, Zap, Summon, Goto, Gate, Fire,
} from '../magic/spells';
import Connection from '../../server/connection';

export abstract class Agent {
  id: string = uuid.v4()
  name: string
  abstract job: Job
  abstract look: Look

  position: Vector = new Vector()
  velocity: Vector = new Vector()

  queue: Array<Command> = []
  stack: Stack<Item> = new Stack()

  health: Health = new Health()
  stamina: Stamina = new Stamina()
  mana: Mana = new Mana()
  wealth: Wealth = new Wealth()

  wield: Weapon | null = null
  wear: Clothes | null = null
  hold: Relic | null = null

  items: Array<Item> = []

  takeTurn() {
    return this.queue.shift();
  }
}

export abstract class Players extends Agent {
  name: string
  commands: Array<Command> = []
  job = new NoviceJob()

  constructor(name: string = 'AnonymousPlayer') {
    super();
    this.name = name;
  }
}

export abstract class Critter extends Agent {
  timer: NodeJS.Timeout
  job = new CritterJob()

  constructor(delayMs: number = 1000) {
    super();

    this.timer = setInterval(() => {
      const direction = getRandomDirection();

      this.queue.push(
        new Move(this, direction.x, direction.y),
      );
    }, delayMs);
  }
}

export abstract class Npc extends Agent {
  job = new NoviceJob()
  look = looks.npc
}

export abstract class Bug extends Agent {
  name = 'Bug'
  job = new NoviceJob()
  look = looks.bug
}

/* - Instances - */

export class Player extends Players {
  look = looks.me;

  readonly spells = [
    new Gate(),
    new Heal(),
    new Zap(),
    new Fire(),
    new Teleport(),
    new Goto(),
    new Summon(),
  ]

  private connection: Connection

  constructor(connection) {
    super();
    this.connection = connection;
  }
}

export class Sheep extends Critter {
  name = 'Sheep'
  look = looks.sheep
}

export class Tutor extends Npc {
  name = 'Tutor'
}
