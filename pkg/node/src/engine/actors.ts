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
import { Action } from './actions';

export abstract class Actor {
  name: string
  abstract job: Job

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

  abstract takeTurn(): Action | null
}

class CritterJob extends Job {}
class NoviceJob extends Job {}

export class Critter extends Actor {
  job = new CritterJob()
  takeTurn() {
    return null;
  }
}

export class Player extends Actor {
  job = new NoviceJob()
  takeTurn() {
    return null;
  }
}

export class Monster extends Actor {
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
