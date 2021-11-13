import { Colors, Style } from '../../lib/esc';
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
  appearance: string
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

export abstract class Equipment extends Program {
  appearance: string
}

export class Wall extends Thing {
  name = 'wall'
  appearance =  Style.in(Colors.Bg.White, Colors.Fg.Black, '##')
}

export class Tree extends Thing {
  name = 'tree'
  appearance = '🌲'
}

export class Grass extends Thing {
  name = 'grass'
  appearance = Style.in(Colors.Bg.Black, Colors.Fg.Green, '##')
}

export class Flag extends Thing {
  name = 'flag'
  appearance = '🚩'
}

export class Book extends Thing {
  name = 'book'
  appearance = '📕'
}

export class Gold extends Thing {
  name = 'gold'
  appearance = '💰'
}

export class Teleporter extends Program {
  name = 'teleporter'
  destination: Destination
}
