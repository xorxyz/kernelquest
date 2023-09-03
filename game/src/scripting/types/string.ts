import { Literal } from '../literal';

export class StringType extends Literal {
  override toString(): string {
    return `"${this.lexeme}"`;
  }

  override serialize(): string {
    return this.toString();
  }
}
