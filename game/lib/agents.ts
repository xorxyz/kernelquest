import { Hero, Foe, Friend } from '../engine/agents';
import { Glyph } from '../engine/cell';
import { RandomWalkCapability } from './capabilities';

export class Cherub extends Hero {
  name = 'cherub';
  glyph = new Glyph('👼');
}

export class Fairy extends Hero {
  name = 'fairy';
  glyph = new Glyph('🧚');
}

export class Elf extends Hero {
  name = 'elf';
  glyph = new Glyph('🧝');
}

export class Wizard extends Hero {
  name = 'wizard';
  glyph = new Glyph('🧙');
}

export class Sheep extends Friend {
  name = 'sheep';
  glyph = new Glyph('🐑');
  capabilities = [new RandomWalkCapability()];
  weight = 10;
}

export class Bug extends Foe {
  name = 'bug';
  glyph = new Glyph('🐛');
  capabilities = [new RandomWalkCapability()];
}
