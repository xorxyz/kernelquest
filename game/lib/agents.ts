import { Hero, Foe, Friend, House } from '../src/agent';
import { Glyph } from '../src/cell';
import { RandomWalkCapability } from '../src/capabilities';

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
