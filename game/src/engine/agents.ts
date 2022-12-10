import { Colors, esc } from '../shared';
import {
  AgentType, Foe, Friend, Glyph, Hero,
} from '.';
import { RandomWalkCapability } from './capabilities';

/** @category Agent */
export abstract class Element extends AgentType {
  style = esc(Colors.Bg.White);
}

/** @category Agent */
export abstract class House extends AgentType {
  style = esc(Colors.Bg.Black);
}

/** @category Agent */
export class Spirit extends Hero {
  name = 'spirit';
  glyph = new Glyph('👼');
  weight = 1;
}

/** @category Agent */
export class Man extends Hero {
  name = 'man';
  glyph = new Glyph('👨');
  weight = 1;
}

/** @category Agents */
export class King extends Hero {
  name = 'king';
  glyph = new Glyph('🤴');
  weight = 1;
}

// /** @category Agents */
export class Dragon extends Foe {
  name = 'dragon';
  glyph = new Glyph('🐉');
  weight = 1;
  capabilities = [];
}

/** @category Agents */
export class Wind extends Element {
  name = 'wind';
  glyph = new Glyph('🌬️ ');
  weight = 0;
  capabilities = [];
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

export const agents = {
  wind: Wind,
  water: Water,
  earth: Earth,
  fire: Fire,
  king: King,
  dragon: Dragon,
  spirit: Spirit,
};
