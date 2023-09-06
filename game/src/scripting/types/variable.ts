import { Literal } from '../literal';

export class VariableType extends Literal {
  override toString(): string {
    return `?${this.lexeme}`;
  }

  override serialize(): string {
    return this.toString();
  }

  override clone(): VariableType {
    return new VariableType(this.lexeme);
  }
}
