import { Vector, Points } from '../../lib/math';
import { Char, DataType, IProgram, List, Ref, Transform } from './language';
import { Room } from './world';

export class Durability extends Points {}
export class Uses extends Points {}
export interface Destination {
  room: Room
  position: Vector
}

export abstract class Thing {
  abstract name: string
  readonly type: DataType
  position: Vector = new Vector()
  velocity: Vector = new Vector()
  durability: Durability = new Durability()
}

export abstract class Program extends Thing implements IProgram {
  type: List
  transforms: Array<Transform>
}

export abstract class Particle extends Program {
  sequence: Array<Program>
}

export abstract class Item extends Program {
  uses: Uses
  abstract use(): void
}

export abstract class Equipment extends Program {}

export class Wall extends Thing {
  name: 'wall'
  type: Char
}

export class Teleporter extends Program {
  name: 'teleporter'
  destination: Destination
}
