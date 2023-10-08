import { Literal } from '../literal';

export class StringType extends Literal {
  override readonly value: string

  constructor (lexeme: string) {
    super('String', lexeme);
    this.value = lexeme;
  }

  override toString(): string {
    return `"${this.lexeme}"`;
  }

  override serialize(): string {
    return this.toString();
  }

  override clone(): StringType {
    return new StringType(this.lexeme);
  }
}
