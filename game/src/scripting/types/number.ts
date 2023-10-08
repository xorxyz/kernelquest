import { SerializableType } from '../../shared/interfaces';
import { logger } from '../../shared/logger';
import { Literal } from '../literal';

export class NumberType extends Literal {
  override readonly value: number;

  constructor(value: number) {
    super('Number', String(value));
    logger.debug(value)
    this.value = value;
  }

  override serialize(): SerializableType {
    return this.value;
  }

  override clone(): NumberType {
    return new NumberType(this.value);
  }
}
