import { Literal } from '../literal';

export class Truth extends Literal {
  override value: boolean

  constructor (value: boolean) {
    super('Truth', String(value))
    this.value = value;
  }
  
  override toString(): string {
    return this.lexeme;
  }

  override serialize(): string {
    return this.toString();
  }

  override clone(): Truth {
    return new Truth(this.value);
  }
}
