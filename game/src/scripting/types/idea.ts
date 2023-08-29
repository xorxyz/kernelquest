import { Literal } from '../literal';

export class Idea extends Literal {
  readonly value: number;

  constructor(n: number) {
    super(String(n));
    this.value = n;
  }

  override toString(): string {
    return `&${this.lexeme}`;
  }
}
