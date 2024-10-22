import { SerializableType } from '../../shared/interfaces';
import { Literal } from '../literal';

export class Idea extends Literal {
  override readonly value: number;

  constructor(value: number) {
    super('Idea', String(value));
    this.value = value;
  }

  override toString(): string {
    return `&${this.lexeme}`;
  }

  override serialize(): SerializableType {
    return this.toString();
  }

  override clone(): Idea {
    return new Idea(this.value);
  }
}
