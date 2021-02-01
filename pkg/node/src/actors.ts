import { Item } from './items';
import { Vector } from './math';
import { Health, Stamina, Mana, Job, Gold, Emoji } from './caps';
import { Weapon, Clothing, Relic } from './items';

export class Actor {
  name: string
  job: Job

  emoji: Emoji
  hp: Health
  sp: Stamina
  mp: Mana
  gp: Gold

  position: Vector
  velocity: Vector
  direction: Vector

  wield: Weapon | null
  wear: Clothing | null
  hold: Relic | null

  items: Array<Item>
}

export class Critter extends Actor {}
export class Player extends Actor {}
export class Monster extends Actor {}
export class NPC extends Actor {}
