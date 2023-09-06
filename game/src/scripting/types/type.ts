import { Literal } from '../literal';

export class LiteralType extends Literal {  
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
