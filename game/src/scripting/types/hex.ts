import { SerializableType } from '../../shared/interfaces';
import { Literal } from '../literal';

export class HexType extends Literal {
  override readonly value: number
   
  constructor(value: number) {
    super(String(value))
    this.value = value;
  }
  override toString(): string {
    return `x${this.lexeme}`;
  }

  override serialize(): SerializableType {
    return this.toString();
  }

  override clone(): HexType {
    return new HexType(this.value);
  }
}
