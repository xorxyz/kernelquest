import { Literal } from '../literal';

export class VariableType extends Literal {
  override toString(): string {
    return `?${this.lexeme}`;
  }
}
