/*
 * living entities are called actors
 *
 */

import * as uuid from 'uuid';
import {
  Item, Weapon, Clothes, Relic,
} from './items';
import {
  Health, Stamina, Mana, Wealth, SheepLook, WizardLook, Look, MonsterLook, NpcLook,
} from './capabilities';
import { Job, WizardJob } from './jobs';
import { Command, MoveCommand } from './commands';
import { RandomVector, Vector } from '../../lib/math';
import { getRandomDirection } from '../../lib/utils';

export abstract class Actor {
  id: string = uuid.v4()
  name: string
  abstract job: Job
  abstract look: Look

  position: Vector = new Vector()
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
    const action = this.queue.shift();

    if (action) {
      console.log('turn w action');
      return action.execute(this);
    }

    return false;
  }
}

class CritterJob extends Job {}
class NoviceJob extends Job {}

export class Player extends Actor {
  name = 'AnonymousPlayer'
  commands: Array<Command> = []
  job = new NoviceJob()
  look = new WizardLook();

  constructor(name?: string) {
    super();
    if (name) {
      this.name = name;
    }
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
  takeTurn() {
    return null;
  }
}

export class Npc extends Actor {
  job = new NoviceJob()
  look = new NpcLook()
  takeTurn() {
    return null;
  }
}
