import { Player, Monster } from './actors';
import { Living } from './caps';

type Caster = Player | Monster

/* represents the contract for the execution of a command, costs mana to use */
export abstract class Spell {
  command: string
  cost: number

  abstract $cast(caster: Caster, target: Living, args?: Array<string>): Boolean

  cast(caster, target, args) {
    this.$cast(caster, target, args);
  }
}

export abstract class HealingSpell extends Spell {
  command: 'heal'
  cost: 10

  $cast(caster: Caster, target: Living) {
    caster.mana.decrease(this.cost);
    target.health.increase(10);

    return true;
  }
}
