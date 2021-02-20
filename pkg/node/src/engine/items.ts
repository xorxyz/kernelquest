/*
 * actors can take actions every tick
 */

import { Vector } from '../../lib/math';
import { Actor } from './actors';
import { Durability } from './capabilities';
import { looks } from './looks';
import { Spell } from './spells';

export abstract class Item {
  look: typeof looks.gold

  position: Vector = new Vector()
  private owner: Actor | null = null
  private durability: Durability = new Durability()

  abstract use(user, target?): Boolean
}

export abstract class Weapon extends Item {}
export abstract class Clothes extends Item {}
export abstract class Relic extends Item {}
export abstract class Wall extends Item {}

export class WallItem extends Wall {
  look = looks.wall
  use() {
    return false;
  }
}

/* unlocks a locked door. one time use. */
export class GoldItem extends Item {
  amount: number
  look = looks.gold

  constructor(amount: number) {
    super();
    this.amount = amount;
  }

  use() {
    return true;
  }
}

/* represents the contract for the execution of a spell, costs mana to use */
export class ScrollItem extends Item {
  spell: Spell
  look = looks.scroll

  use() {
    return true;
  }
}

/* unlocks a locked door. one time use. */
export class KeyItem extends Item {
  color: 'blue' | 'green' | 'red'
  look = looks.key

  use() {
    return true;
  }
}
