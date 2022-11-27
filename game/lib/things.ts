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
export class Wall extends BodyType {
  name = 'wall';
  glyph = new Glyph('##');
  style = esc(Colors.Bg.White) + esc(Colors.Fg.Black);
  isStatic = false;
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
export class Stars extends BodyType {
  name = 'stars';
  glyph = new Glyph('✨');
}

/** @category Things */
export class Key extends BodyType {
  name = 'key';
  glyph = new Glyph('🔑');
}

/** @category Things */
export class Shield extends BodyType {
  name = 'shield';
  glyph = new Glyph('🛡️ ');
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

export const thingDict = {
  tree: Tree,
};
