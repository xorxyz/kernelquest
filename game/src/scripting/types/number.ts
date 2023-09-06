import { SerializableType } from '../../shared/interfaces';
import { Literal } from '../literal';

export class NumberType extends Literal {
  readonly value: number;

  constructor(value: number) {
    super(String(value));
    this.value = value;
  }

  override serialize(): SerializableType {
    return this.value;
  }

  override clone(): NumberType {
    return new NumberType(this.value);
  }
}
