import { Literal } from '../literal';

export class VariableType extends Literal {
  constructor (lexeme: string) {
    super('Variable', lexeme);
  }
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
