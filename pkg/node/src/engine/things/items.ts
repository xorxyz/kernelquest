/*
 * actors can take actions every tick
 */
import { Agent } from '../agents/agents';
import { Durability } from '../physics/durability';
import { looks } from '../visuals/looks';
import { Spell } from '../magic/spells';
import { VisibleThing } from './ideas';

export abstract class Item extends VisibleThing {
  private owner: Agent | null = null
  private durability: Durability = new Durability()

  abstract use(user, target?): Boolean
}

export abstract class Consumable extends Item {
  used: boolean = false
  abstract $use(): boolean

  use() {
    this.used = this.$use();
    return true;
  }
}

/** increments your gold score by n. one time use. */
export class GoldItem extends Consumable {
  name = 'gold'
  look = looks.gold
  amount: number

  constructor(amount: number) {
    super();
    this.amount = amount;
  }

  $use() {
    return true;
  }
}

/* represents the contract for the execution of a spell, costs mana to use */
export class ScrollItem extends Consumable {
  name = 'scroll'
  look = looks.scroll
  spell: Spell

  $use() {
    return true;
  }
}

/* unlocks a locked door. one time use. */
export class KeyItem extends Consumable {
  name = 'key'
  look = looks.key
  color: 'blue' | 'green' | 'red'

  $use() {
    return true;
  }
}
