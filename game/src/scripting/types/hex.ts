import { SerializableType } from '../../shared/interfaces';
import { Literal } from '../literal';

export class HexType extends Literal {
  override toString(): string {
    return `x${this.lexeme}`;
  }

  override serialize(): SerializableType {
    return this.toString();
  }

  override clone(): HexType {
    return new HexType(this.lexeme);
  }
}
