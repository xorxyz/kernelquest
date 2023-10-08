import { Literal } from '../literal';

export class LiteralType extends Literal {
  constructor(lexeme: string) {
    super('Type', lexeme)
  }

  override toString(): string {
    return this.lexeme;
  }

  override serialize(): string {
    return this.toString();
  }

  override clone(): LiteralType {
    return new LiteralType(this.lexeme);
  }
}
