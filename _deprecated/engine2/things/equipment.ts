import { Quotation } from '../../shell/types';
import { looks } from '../visuals/looks';

export abstract class Weapon extends Quotation {}
export abstract class Clothes extends Quotation {}
export abstract class Relic extends Quotation {}

/** a magic orb is a function that executes expressions on the stack */
export class MagicOrb extends Relic {
  name = 'morb'
  look = looks.orb

  use() {
    return false;
  }
}
