import { Hero, Foe, Friend } from '../src/agent';
import { Glyph } from '../src/cell';
import { RandomWalkCapability } from './capabilities';

/** @category Agents */
export class King extends Hero {
  name = 'king';
  glyph = new Glyph('🤴');
  weight = 1;
}

/** @category Agents */
export class Wind extends Friend {
  name = 'wind';
  glyph = new Glyph('🌬️ ');
  weight = 0;
}

/** @category Agents */
export class Earth extends Friend {
  name = 'earth';
  glyph = new Glyph('🌱');
  weight = 0;
}

/** @category Agents */
export class Fire extends Friend {
  name = 'fire';
  glyph = new Glyph('🔥');
  weight = 0;
}

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
