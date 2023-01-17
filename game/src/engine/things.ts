import { Colors, esc } from '../shared';
import { Glyph } from './cell';
import { BodyType } from './thing';

/** @category Things */
export class Tree extends BodyType {
  name = 'tree';
  glyph = new Glyph('🌲');
  style = esc(Colors.Bg.Green);
  isStatic = true;
  isBlocking = true;
}

/** @category Thing */
export class Wall extends BodyType {
  name = 'wall';
  glyph = new Glyph('##');
  isStatic = true;
  style = esc(Colors.Bg.Gray) + esc(Colors.Fg.Black);
}

/** @category Thing */
export class Door extends BodyType {
  name = 'door';
  glyph = new Glyph('++');
  isStatic = true;
  style = esc(Colors.Bg.White) + esc(Colors.Fg.Black);
}

/** @category Things */
export class Mountain extends BodyType {
  name = 'mountain';
  glyph = new Glyph('⛰️');
  style = esc(Colors.Bg.Gray) + esc(Colors.Fg.White);
}

/** @category Things */
export class River extends BodyType {
  name = 'river';
  glyph = new Glyph('~~');
  style = esc(Colors.Bg.Blue) + esc(Colors.Fg.White);
  isStatic = true;
  isBlocking = true;
}

/** @category Things */
export class Grass extends BodyType {
  name = 'grass';
  glyph = new Glyph(',,');
  style = esc(Colors.Fg.Green);
  isStatic = true;
  isBlocking = false;
}

/** @category Things */
export class Flag extends BodyType {
  name = 'flag';
  glyph = new Glyph('🚩');
}

/** @category Things */
export class Crown extends BodyType {
  name = 'crown';
  glyph = new Glyph('👑');
}

/** @category Things */
export class Key extends BodyType {
  name = 'key';
  glyph = new Glyph('🔑');
}

/** @category Things */
export class Shield extends BodyType {
  name = 'shield';
  glyph = new Glyph('🛡️');
}

/** @category Things */
export class Skull extends BodyType {
  name = 'skull';
  glyph = new Glyph('💀');
}

/** @category Things */
export class Book extends BodyType {
  name = 'book';
  glyph = new Glyph('📕');
}

/** @category Things */
export class Scroll extends BodyType {
  name = 'scroll';
  glyph = new Glyph('📜');
}

/** @category Things */
export class Fruit extends BodyType {
  name = 'fruit';
  glyph = new Glyph('🍎');
}

/** @category Things */
export class Castle extends BodyType {
  name = 'castle';
  glyph = new Glyph('🏰');
}

/** @category Things */
export class Village extends BodyType {
  name = 'village';
  glyph = new Glyph('🏘️');
}

/** @category Things */
export class Candle extends BodyType {
  name = 'candle';
  glyph = new Glyph('🕯️');
}

/** @category Things */
export class Axe extends BodyType {
  name = 'axe';
  glyph = new Glyph('🪓');
}

/** @category Things */
export class Bomb extends BodyType {
  name = 'bomb';
  glyph = new Glyph('💣');
}

/** @category Things */
export class Bow extends BodyType {
  name = 'bow';
  glyph = new Glyph('🏹');
}

/** @category Things */
export class Bag extends BodyType {
  name = 'bag';
  glyph = new Glyph('🎒');
}

/** @category Things */
export class Boot extends BodyType {
  name = 'boot';
  glyph = new Glyph('🥾');
}

/** @category Things */
export class Map extends BodyType {
  name = 'map';
  glyph = new Glyph('🗺️');
}

/** @category Things */
export class Route extends BodyType {
  name = 'route';
  glyph = new Glyph('━━');
  style = esc(Colors.Bg.Black) + esc(Colors.Fg.White);
  isBlocking = false;
}
