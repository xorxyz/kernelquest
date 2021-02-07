/*
 * actors have capabilities
 */

import { Vector } from '../lib/math';
import { Heading } from './constants';

/* Unique identifiers */
export class Id {
  id: string
}

/* Where is it? */
export class Transform {
  direction: Heading
  position: Vector
  velocity: Vector
}

/* Connect things to other things */
export class Port {
  value: number | null
}

/* What it looks like */
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

/* Items break. */
export class Durability extends Points {}

export interface HasHealth {
  health: Health
}

export interface HasMana {
  mana: Mana
}

export interface ITargetable {
  id: Id
}
