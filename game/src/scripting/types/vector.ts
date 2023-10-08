import { Vector } from '../../shared/vector';
import { Literal } from '../literal';
import { Quotation } from './quotation';

export class LiteralVector extends Literal {
  override readonly value = new Vector();

  constructor(v: Vector) {
    super('Vector', v.label);
    this.value = v.clone();
  }

  static isVector(quotation: Quotation) {
    return quotation.value.length === 2 && quotation.toJS().every((item: unknown) => typeof item === 'number');
  }

  override toString(): string {
    return this.value.label;
  }

  override clone(): LiteralVector {
    return new LiteralVector(this.value.clone());
  }
}
