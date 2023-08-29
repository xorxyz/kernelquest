import { Literal } from '../literal';

export class StringType extends Literal {
  override toString(): string {
    return `"${this.lexeme}"`;
  }
}
