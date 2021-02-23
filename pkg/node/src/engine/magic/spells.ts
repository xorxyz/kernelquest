/*
 * spells represent the contract for the execution of a command
 */
import { Actor, Player } from '../actors/actors';
import { Word } from '../things/items';

type Caster = Player
type Target = Actor

export abstract class Spell extends Word {
  command: string
  cost: number

  abstract $cast(target, args?: Array<any>): Boolean

  cast(caster: Actor, target: Actor, args) {
    caster.mana.decrease(this.cost);

    this.$cast(target, args);
  }
}

export class Nop extends Spell {
  command = 'NOP'
  cost: 0

  $cast() {
    return true;
  }
}

export class Gate extends Spell {
  command = 'gate'
  cost: 0

  $cast() {
    return true;
  }
}

export class Goto extends Spell {
  command = 'goto'
  cost: 30

  $cast() {
    return true;
  }
}

export class Zap extends Spell {
  command = 'zap'
  cost: 10

  $cast() {
    return true;
  }
}

export class Fire extends Spell {
  command = 'fire'
  cost: 10

  $cast() {
    return true;
  }
}

export class Ice extends Spell {
  command = 'ice'
  cost: 10

  $cast() {
    return true;
  }
}

export class Heal extends Spell {
  command = 'heal'
  cost: 10

  $cast(target: Actor) {
    if (!target.health) return false;

    target.health.increase(10);

    return true;
  }
}

export class Teleport extends Spell {
  command = 'teleport'
  cost: 10

  $cast(target: Actor, [position]) {
    if (!target.position) return false;

    target.position.copy(position);

    return true;
  }
}

export class Summon extends Spell {
  command = 'summon'
  cost: 30

  $cast() {
    return true;
  }
}
