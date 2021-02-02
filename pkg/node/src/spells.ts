import { Player, Monster } from './actors';

type Caster = Player | Monster

/* represents the contract for the execution of a command */
export abstract class Spell {
  command: string
  cost: number

  abstract $cast(target, args?: Array<string>): Boolean

  cast(caster, target, args) {
    caster.mana.decrease(this.cost);

    this.$cast(target, args);
  }
}

export class HealingSpell extends Spell {
  command: 'heal'
  cost: 10

  $cast(target) {
    if (!target.health) return false;

    target.health.increase(10);

    return true;
  }
}
