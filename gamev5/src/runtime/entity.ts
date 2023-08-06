import { Nature } from './nature';

export class Entity {
  readonly id: symbol;

  readonly nature: Nature;

  constructor(id: symbol, nature: Nature) {
    this.id = id;
    this.nature = nature;
  }
}
