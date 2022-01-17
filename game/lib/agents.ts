import { Foe, Friend, HeroType } from '../engine/agents';
import { RandomWalkCapability } from './capabilities';

export class Cherub extends HeroType {
  appearance = '👼';
  name = 'cherub';
}

export class Fairy extends HeroType {
  name = 'fairy';
  appearance = '🧚';
}

export class Elf extends HeroType {
  name = 'elf';
  appearance = '🧝';
}

export class Wizard extends HeroType {
  name = 'wizard';
  appearance = '🧙';
}

export class Sheep extends Friend {
  name = 'sheep';
  appearance = '🐑';
  capabilities = [new RandomWalkCapability()];
  weight = 10;
}

export class Bug extends Foe {
  name = 'bug';
  appearance = '🐛';
  capabilities = [new RandomWalkCapability()];
}
