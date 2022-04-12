import { Hero, Foe, Friend } from '../src/agent';
import { Glyph } from '../src/cell';
import { RandomWalkCapability } from './capabilities';

/** @category Agents */
export class Spirit extends Hero {
  name = 'spirit';
  glyph = new Glyph('👼');
  weight = 1;
}

/** @category Agents */
export class Fairy extends Hero {
  name = 'fairy';
  glyph = new Glyph('🧚');
}

/** @category Agents */
export class Elf extends Hero {
  name = 'elf';
  glyph = new Glyph('🧝');
}

/** @category Agents */
export class Wizard extends Hero {
  name = 'wizard';
  glyph = new Glyph('🧙');
}

/** @category Agents */
export class Sheep extends Friend {
  name = 'sheep';
  glyph = new Glyph('🐑');
  capabilities = [new RandomWalkCapability()];
  weight = 10;
}

/** @category Agents */
export class Bug extends Foe {
  name = 'bug';
  glyph = new Glyph('🐛');
  capabilities = [new RandomWalkCapability()];
}
