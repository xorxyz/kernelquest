import { Colors, Style } from 'xor4-lib/esc';
import { Thing } from '../engine/things';

export class Wall extends Thing {
  name = 'wall';
  appearance = Style.in(Colors.Bg.White, Colors.Fg.Black, '##');
  isStatic = true;
}

export class Tree extends Thing {
  name = 'tree';
  appearance = '🌲';
  isStatic = true;
}

export class Grass extends Thing {
  name = 'grass';
  appearance = Style.in(Colors.Bg.Black, Colors.Fg.Green, '##');
  isStatic = true;
}

export class Flag extends Thing {
  name = 'flag';
  appearance = '🚩';
}

export class Book extends Thing {
  name = 'book';
  appearance = '📕';
}

export class Gold extends Thing {
  name = 'gold';
  appearance = '💰';
}
