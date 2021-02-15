/*
 * living entities are called actors
 *
 */

import {
  Item, Weapon, Clothes, Relic,
} from './items';
import {
  Health, Stamina, Mana, Wealth, Look, Transform,
} from './capabilities';
import { Job } from './jobs';
import { Command } from './commands';

export abstract class Actor {
  name: string
  abstract job: Job

  queue: Array<Command> = []

  transform: Transform = new Transform()

  look: Look = new Look()
  health: Health = new Health()
  stamina: Stamina = new Stamina()
  mana: Mana = new Mana()
  wealth: Wealth = new Wealth()

  wield: Weapon | null = null
  wear: Clothes | null = null
  hold: Relic | null = null

  items: Array<Item> = []

  abstract takeTurn()
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

  takeTurn() {
    console.log('turn');
    const action = this.queue.shift();

    if (action) {
      console.log('   w action');
      action.execute(this);
    }

    return null;
  }
}

export class Critter extends Actor {
  name = 'Critter'
  job = new CritterJob()
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
