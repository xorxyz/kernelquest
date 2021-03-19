import { esc, Style } from '../../lib/esc';
import { Vector } from '../../lib/math';
import { Literal, Word } from '../../shell/types';
import { Look } from '../visuals/looks';

export abstract class Thing extends Word {
  position: Vector = new Vector()
  look: Look
  blocking = false
}

export abstract class LiteralItem extends Thing {
  literal: Literal
}

export class WallTop extends Thing {
  name = 'wall-top'
  look = new Look('wall', '██', 'it looks like it\'s in your way')
  blocking= true

  use() {
    return false;
  }
}
export class Wall extends Thing {
  name = 'wall'
  look = new Look('wall', '░░', 'it looks like it\'s in your way')
  blocking= true

  use() {
    return false;
  }
}

export class Door extends Thing {
  name = 'door'
  look = new Look('door', '🚪', 'you go through these to enter or leave')

  use() {
    return false;
  }
}

export class Lock extends Thing {
  name = 'lock'
  look = new Look('lock', '🔒', 'i\'ll ned a key to unlock that')
  use() {
    return false;
  }
}
