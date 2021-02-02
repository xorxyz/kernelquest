/*  capabilities  */

/* Unique identifiers */
export class Id {
  id: string
}

/* What a thing looks like */
export class Look {
  emoji?: string
  description: string
}

export abstract class Points {
  value: number = 100
  cap: number = 99999999

  increase(amount: number) {
    this.value = Math.min(this.value + amount, this.cap);
  }

  decrease(amount: number) {
    this.value = Math.max(this.value - amount, 0);
  }
}

/* Determines if you are alive or dead. */
export class Health extends Points {}

/* Throttles the actor's actions every turn. */
export class Stamina extends Points {}

/* Limits the kind of program you are allowed to run.  */
export class Mana extends Points {}

/* Points to buy things. */
export class Wealth extends Points {}

export interface HasHealth {
  health: Health
}

export interface HasMana {
  mana: Mana
}
