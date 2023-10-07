import { Vector } from '../../shared/vector';
import { Literal } from '../literal';

export class LiteralVector extends Literal {
  override readonly value = new Vector();

  constructor(v: Vector) {
    super(v.label);
    this.value = v.clone();
  }

  override toString(): string {
    return this.value.label;
  }

  override clone(): LiteralVector {
    return new LiteralVector(this.value.clone());
  }
}
