import {
  Item, Weapon, Clothes, Relic,
} from './items';
import {
  Health, Stamina, Mana, Wealth, Look, Transform,
} from './caps';
import { Job } from './jobs';
import { Action } from './actions';

export abstract class Actor {
  name: string
  job: Job

  transform: Transform

  look: Look
  health: Health
  stamina: Stamina
  mana: Mana
  wealth: Wealth

  wield: Weapon | null
  wear: Clothes | null
  hold: Relic | null

  items: Array<Item>

  abstract takeTurn(): Action | null
}

export class Critter extends Actor {
  takeTurn() {
    return null;
  }
}

export class Player extends Actor {
  takeTurn() {
    return null;
  }
}

export class Monster extends Actor {
  takeTurn() {
    return null;
  }
}

export class NPC extends Actor {
  takeTurn() {
    return null;
  }
}
