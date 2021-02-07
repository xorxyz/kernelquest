/*
 * actors can take actions every tick
 */

import { Actor } from './actors';
import { Durability } from './capabilities';
import { Spell } from './spells';

export abstract class Item {
  owner: Actor
  durability: Durability

  abstract use(user, target?): Boolean
}

export abstract class Weapon extends Item {}
export abstract class Clothes extends Item {}
export abstract class Relic extends Item {}

/* generates random values, costs mana to use */
export class DiceItem extends Item {
  use() {
    return true;
  }
}

/* represents the contract for the execution of a spell, costs mana to use */
export class ScrollItem extends Item {
  spell: Spell
  use() {
    return true;
  }
}

/* unlocks a locked door. one time use. */
export class KeyItem extends Item {
  color: 'blue' | 'green' | 'red'
  use() {
    return true;
  }
}
