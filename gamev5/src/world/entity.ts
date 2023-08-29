import { Nature } from './nature';

export class Entity {
  readonly id: number;

  readonly nature: Nature;

  constructor(id: number, nature: Nature) {
    this.id = id;
    this.nature = nature;
  }
}
