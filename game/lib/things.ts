import { Colors, esc } from 'xor4-lib/esc';
import { Glyph } from '../engine/cell';
import { EntityType } from '../engine/things';

export class Wall extends EntityType {
  name = 'wall';
  glyph = new Glyph('##');
  style = esc(Colors.Bg.White) + esc(Colors.Fg.Black);
  isStatic = true;
}

export class Tree extends EntityType {
  name = 'tree';
  glyph = new Glyph('🌲');
  style = esc(Colors.Bg.Green);
  isStatic = true;
}

export class Grass extends EntityType {
  name = 'grass';
  glyph = new Glyph(',,');
  style = esc(Colors.Fg.Green);
  isStatic = true;
  isBlocking = false;
}

export class Flag extends EntityType {
  name = 'flag';
  glyph = new Glyph('🚩');
}

export class Crown extends EntityType {
  name = 'crown';
  glyph = new Glyph('👑');
}

export class Book extends EntityType {
  name = 'book';
  glyph = new Glyph('📕');
}

export class Gold extends EntityType {
  name = 'gold';
  glyph = new Glyph('💰');
}
