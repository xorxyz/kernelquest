import { Actor } from './actors';
import { HasHealth, Health } from './caps';
import { Spell } from './spells';

export class Item implements HasHealth {
  owner: Actor
  health: Health
}

export abstract class Weapon extends Item {}
export abstract class Clothes extends Item {}
export abstract class Relic extends Item {}

/* generates random values, costs mana to use */
export class DiceItem extends Item {}

/* represents the contract for the execution of a spell, costs mana to use */
export class ScrollItem extends Item {
  spell: Spell
}

/* unlocks a locked door. one time use. */
export class KeyItem extends Item {
  color: 'blue' | 'green' | 'red'
}
