/*
 * actors can take actions every tick
 */
import { Vector } from '../../../lib/geom';
import { Stack } from '../../../lib/stack';
import { Actor } from '../actors/actors';
import { Durability } from '../physics/durability';
import { Look, looks } from '../visuals/looks';
import { Spell } from '../magic/spells';

export abstract class Word {
  value: any
}

export abstract class Item extends Word {
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

export class MagicOrb extends Relic {
  look = looks.orb
  value = '🔮M Orb'
  use() {
    return false;
  }
}

export class WallItem extends Wall {
  look = looks.wall
  value = '██ Wall'
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

export type ItemStack = Stack<Item>

export abstract class Literal extends Item {
  constructor(value: any) {
    super();

    this.value = value;
  }

  exec(stack: ItemStack) {
    stack.push(this.value);

    return stack;
  }
}

export class StringLiteral extends Literal {
  use() {
    return true;
  }
}

export class NumberLiteral extends Literal {
  n: number

  constructor(n: number) {
    super(n);

    const str = String(n);
    this.n = n;
    this.look = new Look(str, n.toString(16).padStart(2, '0'), str);
  }
  use() {
    return true;
  }
}

export class BooleanLiteral extends Literal {
  constructor(value: boolean) {
    super(value);
    const str = String(value);
    this.look = new Look(str, str.slice(0, 2), str);
  }
  use() {
    return true;
  }
}

export abstract class Operator extends Item {
  readonly arity: number

  constructor(arity: number) {
    super();

    this.arity = arity;
  }

  abstract $exec(): void

  exec(stack: ItemStack) {
    const operands = this.pullOperands(stack);

    if (operands.length !== this.arity) {
      return false;
    }

    this.$exec();

    return true;
  }

  pullOperands(stack: ItemStack) {
    const items = stack.popN(this.arity);

    return items;
  }
}

export abstract class Quotation extends Item {
  list: Array<Word>

  constructor(list: Array<Word>) {
    super();
    this.list = list;
  }
}
