import { Vector } from '../../../lib/geom';
import { Stack } from '../../../lib/stack';
import { Actor } from '../actors/actors';
import { Item } from '../things/items';

export class Port {}

export class Cell {
  position: Vector
  stack: Stack<Item>
  ports: Array<Port>
  actor?: Actor

  constructor(x: number, y: number) {
    this.position.setXY(x, y);
  }
}

export abstract class Room {
  name: String
  readonly cells: Array<Cell>
  readonly actors: Array<Actor>
}

export class EmptyRoom extends Room {}
