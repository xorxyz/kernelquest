import { Vector } from '../lib/math';
import { Actor } from './actors';
import { Item } from './items';

enum Heading { North, East, South, West }

export class Port {
  heading: Heading
}

export class Cell {
  position: Vector
  stack: Array<Item>
  ports: Array<Port>
  actor?: Actor

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }
}

export class Room {
  name: String
  readonly layout: Array<Cell>
}

export abstract class Place {
  name: String
  rooms: Array<Room>
  width: number = 8
}

export class World {
  places: Array<Place>
  width: number = 8
}

export class Town extends Place {}

export class Dungeon extends Place {}

export class Zone extends Place {}
