import { Vector } from '../../lib/math';
import { Look } from '../visuals/looks';

export abstract class Thing {
  name: string
  position: Vector = new Vector()
  look: Look
  blocking = true
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
  look = new Look('lock', '🔒', 'i\'ll need a key to unlock that')
  use() {
    return false;
  }
}
