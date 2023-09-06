import { SerializableType } from '../../shared/interfaces';
import { Literal } from '../literal';

export class Idea extends Literal {
  readonly value: number;

  constructor(lexeme: string) {
    super(lexeme);
    this.value = Number(lexeme);
  }

  override toString(): string {
    return `&${this.lexeme}`;
  }

  override serialize(): SerializableType {
    return this.toString();
  }

  override clone(): Idea {
    return new Idea(this.lexeme);
  }
}
