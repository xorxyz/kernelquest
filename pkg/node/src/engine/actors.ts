/*
 * living entities are called actors
 */
import * as uuid from 'uuid';
import {
  Item,
  Weapon,
  Clothes,
  Relic,
} from './items';
import {
  Health,
  Stamina,
  Mana,
  Wealth,
} from './capabilities';
import {
  SheepLook,
  WizardLook,
  Look,
  MonsterLook,
  NpcLook,
} from './looks';
import {
  Job,
  CritterJob,
  NoviceJob,
  WizardJob,
} from './jobs';
import { Command, MoveCommand } from './commands';
import { Vector } from '../../lib/math';
import { getRandomDirection } from '../../lib/utils';

export abstract class Actor {
  id: string = uuid.v4()
  name: string
  abstract job: Job
  abstract look: Look

  position: Vector = new Vector()
  velocity: Vector = new Vector()

  queue: Array<Command> = []

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

export class Player extends Actor {
  name: string
  commands: Array<Command> = []
  job = new NoviceJob()
  look = new WizardLook();

  constructor(name: string = 'AnonymousPlayer') {
    super();
    this.name = name;
  }
}

export class Wizard extends Player {
  job = new WizardJob();
  look = new WizardLook();
}

export class Critter extends Actor {
  name = 'Critter'
  job = new CritterJob()
  look = new SheepLook()

  timer: NodeJS.Timeout

  constructor(delayMs: number = 1000) {
    super();

    this.timer = setInterval(() => {
      const direction = getRandomDirection();

      this.queue.push(
        new MoveCommand(direction.x, direction.y),
      );
    }, delayMs);
  }
}

export class Monster extends Actor {
  name = 'Monster'
  job = new NoviceJob()
  look = new MonsterLook();
}

export class Npc extends Actor {
  job = new NoviceJob()
  look = new NpcLook()
}

export class TutorNpc extends Npc {

}
