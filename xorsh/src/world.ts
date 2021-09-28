import { Vector } from '../../lib/math';
import { MAX_X, MAX_Y } from '../../lib/constants';

abstract class DataType {
  value: any
  abstract name: string
  get appearance () {
    return this.value
  }
}

export abstract class Thing {
  abstract name: string
  readonly type: DataType
  position: Vector = new Vector()
  velocity: Vector = new Vector()
}

type Memory = Array<Thing>

export class Ref {
  readonly address: number
  private memory: Memory

  get value() {
    return this.memory[this.address];
  }

  constructor(memory: Memory, x: number, y: number) {
    if (x < 0 || x > MAX_X || y < 0 || y > MAX_Y) {
      throw new Error(`ref out of bounds (${x},${y})`);
    }
    this.memory = memory;
    this.address = (y * MAX_X) + x;
  }
}
