import { looks } from '../visuals/looks';
import { Item } from './items';

export abstract class Block extends Item {}

export abstract class Wall extends Block {}

/** a wall is a function that blocks your movement */
export class WallItem extends Wall {
  name = 'wall'
  look = looks.wall

  use() {
    return false;
  }
}
