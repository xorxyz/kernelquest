import { Vector } from '../../lib/math';
import { Char, DataType, List, Ref, Transform } from './language';
import { Points } from './lib';
import { Room } from './places';

export abstract class Thing {
  name: string
  type: DataType
  ref: Ref
  appearance: string
  position: Vector = new Vector()
  velocity: Vector = new Vector()

  constructor(name: string) {
    this.name = name;
  }
}

export class Wall extends Thing {
  type: Char
}

export abstract class Program extends Thing {
  type: List
  transforms: Array<Transform>
}

export class Chunk extends Program {}

export class ParticleProgram extends Program {}
export class Particle extends Program {
  sequence: Array<ParticleProgram>
}

export class Uses extends Points {}
export abstract class Item extends Program {
  uses: Uses

  abstract use(): void
}

export class Durability extends Points {}
export abstract class Equipment extends Program {
  durability: Durability
}

export interface Destination {
  room: Room
  position: Vector
}
export class Teleporter extends Program {
  destination: Destination
}
