import { Colors, esc } from 'xor4-lib/esc';
import { Glyph } from '../src/cell';
import { EntityType } from '../src/thing';

/** @category Things */
export class Tree extends EntityType {
  name = 'tree';
  glyph = new Glyph('🌲');
  style = esc(Colors.Bg.Green);
  isStatic = true;
  isBlocking = true;
}

/** @category Things */
export class Grass extends EntityType {
  name = 'grass';
  glyph = new Glyph(',,');
  style = esc(Colors.Fg.Green);
  isStatic = true;
  isBlocking = false;
}

/** @category Things */
export class Water extends EntityType {
  name = 'water';
  glyph = new Glyph('~~');
  style = esc(Colors.Bg.Blue);
  isStatic = true;
  isBlocking = true;
}

/** @category Things */
export class Flag extends EntityType {
  name = 'flag';
  glyph = new Glyph('🚩');
}

/** @category Things */
export class Crown extends EntityType {
  name = 'crown';
  glyph = new Glyph('👑');
}

/** @category Things */
export class Book extends EntityType {
  name = 'book';
  glyph = new Glyph('📕');
}

/** @category Things */
export class Gold extends EntityType {
  name = 'gold';
  glyph = new Glyph('💰');
}
