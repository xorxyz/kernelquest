import { AgentType } from '../engine/agents';
import { RandomWalkCapability } from './capabilities';

export class Cherub extends AgentType {
  appearance = '👼';
  name = 'cherub';
}

export class Fairy extends AgentType {
  name = 'fairy';
  appearance = '🧚';
}

export class Elf extends AgentType {
  name = 'elf';
  appearance = '🧝';
}

export class Wizard extends AgentType {
  name = 'wizard';
  appearance = '🧙';
}

export class Sheep extends AgentType {
  name = 'sheep';
  appearance = '🐑';
  capabilities = [new RandomWalkCapability()];
}

export class Bug extends AgentType {
  name = 'bug';
  appearance = '🐛';
  capabilities = [];
}
