import {
  Item, Weapon, Clothes, Relic,
} from './items';
import { Vector } from '../lib/math';
import {
  Health, Stamina, Mana, Wealth, Look,
} from './caps';
import { Job } from './jobs';

export class Actor {
  name: string
  job: Job

  look: Look
  health: Health
  stamina: Stamina
  mana: Mana
  wealth: Wealth

  position: Vector
  velocity: Vector
  direction: Vector

  wield: Weapon | null
  wear: Clothes | null
  hold: Relic | null

  items: Array<Item>
}

export class Critter extends Actor {}
export class Player extends Actor {}
export class Monster extends Actor {}
export class NPC extends Actor {}
