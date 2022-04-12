import { Colors, esc } from 'xor4-lib';
import { Glyph } from '../src/cell';
import { BodyType } from '../src/thing';

/** @category Things */
export class Tree extends BodyType {
  name = 'tree';
  glyph = new Glyph('🌲');
  style = esc(Colors.Bg.Green);
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
export class Water extends BodyType {
  name = 'water';
  glyph = new Glyph('~~');
  style = esc(Colors.Bg.Blue);
  isStatic = true;
  isBlocking = true;
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
export class Book extends BodyType {
  name = 'book';
  glyph = new Glyph('📕');
}

/** @category Things */
export class Gold extends BodyType {
  name = 'gold';
  glyph = new Glyph('💰');
}
