/*
 * actors can take actions every tick
 */

import { Vector } from '../../lib/math';
import { Actor } from './actors';
import { Durability } from './capabilities';
import { Look, MoneyBagLook } from './looks';
import { Spell } from './spells';

export abstract class Item {
  owner: Actor | null
  position: Vector = new Vector()
  durability: Durability
  look: Look

  abstract use(user, target?): Boolean
}

export abstract class Weapon extends Item {}
export abstract class Clothes extends Item {}
export abstract class Relic extends Item {}

/* unlocks a locked door. one time use. */
export class GoldItem extends Item {
  amount: number
  look = new MoneyBagLook()

  constructor(amount: number) {
    super();
    this.amount = amount;
  }

  use() {
    return true;
  }
}

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
