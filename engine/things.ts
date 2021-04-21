import { Vector, Points } from '../lib/math';
import { Char, DataType, IProgram, List, Ref, Transform } from './language';
import { Room } from './vm';

export class Durability extends Points {}

export abstract class Thing {
  name: string
  type: DataType
  ref: Ref
  appearance: string
  position: Vector = new Vector()
  velocity: Vector = new Vector()
  durability: Durability = new Durability()

  constructor(name: string) {
    this.name = name;
  }
}

export class Wall extends Thing {
  type: Char
}

export abstract class Program extends Thing implements IProgram {
  type: List
  transforms: Array<Transform>
}

export class Gem extends Program {}

export class ParticleProgram extends Program {}
export class Particle extends Program {
  sequence: Array<ParticleProgram>
}

export class Uses extends Points {}

export abstract class Item extends Program {
  uses: Uses

  abstract use(): void
}

export abstract class Equipment extends Program {
}

export interface Destination {
  room: Room
  position: Vector
}

export class Teleporter extends Program {
  destination: Destination
}
