import { Stack } from '../lib/stack';
import { Actor } from './actors';
import { Port, Transform } from './capabilities';
import { Item } from './items';

/*
 * Cell -> Room -> Zone -> World
 */

export class Cell {
  transform: Transform
  stack: Stack<Item>
  ports: Array<Port>
  actor?: Actor

  constructor(x: number, y: number) {
    this.transform.position.setXY(x, y);
  }
}

export abstract class Room {
  name: String
  readonly cells: Array<Cell>
  readonly actors: Array<Actor>
}

export class EmptyRoom extends Room {}

export abstract class Zone {
  name: String
  size: number = 8
  readonly rooms: Array<Room>

  abstract $update(): void

  update() {
    this.$update();
  }
}

export class Town extends Zone {
  $update() {

  }
}

export class Forest extends Zone {
  $update() {

  }
}

export class Mountain extends Zone {
  $update() {

  }
}

export class Tower extends Zone {
  $update() {

  }
}

export class World {
  zones: Array<Zone>
  size: number = 1
}
