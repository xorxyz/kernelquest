/*
 * actors have stats
 */
export abstract class Stat {
  value: number = 100
  cap: number = 100

  increase(amount: number) {
    this.value = Math.min(this.value + amount, this.cap);
  }

  decrease(amount: number) {
    this.value = Math.max(this.value - amount, 0);
  }
}

/* Determines if you are alive or dead. */
export class Health extends Stat {}

/* Throttles the actor's actions every turn. */
export class Stamina extends Stat {}

/* Limits the kind of program you are allowed to run.  */
export class Mana extends Stat {}

/* Points to buy things. */
export class Wealth extends Stat {}

export interface HasHealth {
  health: Health
}

export interface HasMana {
  mana: Mana
}
