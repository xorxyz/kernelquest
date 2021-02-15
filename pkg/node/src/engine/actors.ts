/*
 * living entities are called actors
 *
 */

import * as uuid from 'uuid';
import {
  Item, Weapon, Clothes, Relic,
} from './items';
import {
  Health, Stamina, Mana, Wealth, Transform, SheepLook, WizardLook,
} from './capabilities';
import { Job, WizardJob } from './jobs';
import { Command, MoveCommand } from './commands';
import { RandomVector } from '../../lib/math';

export abstract class Actor {
  id: string = uuid.v4()
  name: string
  abstract job: Job

  transform: Transform = new Transform()
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
      action.execute(this);
    }

    return null;
  }
}

class CritterJob extends Job {}
class NoviceJob extends Job {}

export class Player extends Actor {
  name = 'AnonymousPlayer'
  commands: Array<Command> = []
  job = new NoviceJob()

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
      const direction = new RandomVector();

      this.queue.push(
        new MoveCommand(direction.x, direction.y),
      );
    }, delayMs);
  }

  takeTurn() {
    return null;
  }
}

export class Monster extends Actor {
  name = 'Monster'
  job = new NoviceJob()
  takeTurn() {
    return null;
  }
}

export class Npc extends Actor {
  job = new NoviceJob()
  takeTurn() {
    return null;
  }
}
