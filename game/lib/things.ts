import { Colors, esc } from 'xor4-lib/esc';
import { Thing } from '../engine/things';

export class Wall extends Thing {
  name = 'wall';
  appearance = '##';
  style = esc(Colors.Bg.White) + esc(Colors.Fg.Black);
  isStatic = true;
}

export class Tree extends Thing {
  name = 'tree';
  appearance = '🌲';
  style = esc(Colors.Bg.Green);
  isStatic = true;
}

export class Footsteps extends Thing {
  name = 'footsteps';
  appearance = '👣';
  style = esc(Colors.Bg.Blue);
  isStatic = true;
  isBlocking = false;
}

export class Grass extends Thing {
  name = 'grass';
  appearance = ',,';
  style = esc(Colors.Fg.Green);
  isStatic = true;
  isBlocking = false;
}

export class Flag extends Thing {
  name = 'flag';
  appearance = '🚩';
  style = esc(Colors.Bg.Yellow);
}

export class Book extends Thing {
  name = 'book';
  appearance = '📕';
  style = esc(Colors.Bg.Yellow);
}

export class Gold extends Thing {
  name = 'gold';
  appearance = '💰';
  style = esc(Colors.Bg.Yellow);
}
