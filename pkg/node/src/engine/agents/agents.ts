/*
 * living entities are called actors
 */
import * as uuid from 'uuid';
import Connection from '../../server/connection';
import { Stack } from '../../../lib/stack';
import { Vector, getRandomDirection } from '../../../lib/math';
import { Look, looks } from '../visuals/looks';
import { Item } from '../things/items';
import { Heal, Teleport, Zap, Summon, Goto, Gate, Fire, Spell } from '../magic/spells';
import { Health, Stamina, Mana, Wealth } from './stats';
import { Job, CritterJob, NoviceJob } from './jobs';
import { Command, Move } from './commands';
import { Model } from './model';

export abstract class Being {
  id: string = uuid.v4()

  position: Vector = new Vector()
  velocity: Vector = new Vector()

  health: Health = new Health()
  stamina: Stamina = new Stamina()
}

export abstract class Agent extends Being {
  look: Look
  job: Job

  name: string
  model: Model = new Model()

  spells: Array<Spell> = []

  queue: Array<Command> = []
  stack: Stack<Item> = new Stack()

  mana: Mana = new Mana()
  wealth: Wealth = new Wealth()

  items: Array<Item> = []

  takeTurn() {
    return this.queue.shift();
  }
}

export abstract class Npc extends Agent {
  job = new NoviceJob()
  look = looks.npc

  health: Health = new Health()
  stamina: Stamina = new Stamina()
  mana: Mana = new Mana()
  wealth: Wealth = new Wealth()
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

export abstract class Bug extends Agent {
  name = 'Bug'
  job = new NoviceJob()
  look = looks.bug
}

/* - Instances - */

export class Player extends Agent {
  look = looks.you;
  spells = [
    new Gate(),
    new Heal(),
    new Zap(),
    new Fire(),
    new Teleport(),
    new Goto(),
    new Summon(),
  ]

  private connection: Connection

  constructor(connection, job) {
    super();
    this.connection = connection;
    this.job = job;
  }
}

export class Sheep extends Critter {
  name = 'Sheep'
  look = looks.sheep
}

export class Tutor extends Npc {
  name = 'Tutor'
}
