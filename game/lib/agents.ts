import { Hero, Foe, Friend, Element, House } from '../src/agent';
import { Glyph } from '../src/cell';
import { RandomWalkCapability } from './capabilities';

/** @category Agents */
export class King extends Hero {
  name = 'king';
  glyph = new Glyph('🤴');
  weight = 1;
}

/** @category Agents */
export class Wind extends Element {
  name = 'wind';
  glyph = new Glyph('🌬️ ');
  weight = 0;
}

/** @category Agents */
export class Water extends Element {
  name = 'water';
  glyph = new Glyph('💧');
  weight = 0;
}

/** @category Agents */
export class Earth extends Element {
  name = 'earth';
  glyph = new Glyph('🌱');
  weight = 0;
}

/** @category Agents */
export class Fire extends Element {
  name = 'fire';
  glyph = new Glyph('🔥');
  weight = 0;
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
export class Dragon extends Foe {
  name = 'dragon';
  glyph = new Glyph('🐉');
  weight = 1;
}

/** @category Agents */
export class Bug extends Foe {
  name = 'bug';
  glyph = new Glyph('🐛');
  capabilities = [new RandomWalkCapability()];
}

/** @category Agents */
export class Microbe extends Foe {
  name = 'microbe';
  glyph = new Glyph('🦠');
  capabilities = [];
}

/** @category Things */
export class Temple extends House {
  name = 'temple';
  glyph = new Glyph('🏛️ ');
  capabilities = [];
}
