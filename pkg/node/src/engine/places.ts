/*
 * Places:
 * Cell -> Screen -> Zone -> World
 */

import { Stack } from '../shell/stack';
import { Actor } from './actors';
import { Port, Transform } from './capabilities';
import { Item } from './items';

export class Cell {
  transform: Transform
  stack: Stack<Item>
  ports: Array<Port>
  actor?: Actor

  constructor(x: number, y: number) {
    this.transform.position.setXY(x, y);
  }
}

export abstract class Screen {
  name: String
  readonly cells: Array<Cell>
  readonly actors: Array<Actor>
}

export class EmptyScreen extends Screen {}

export abstract class Zone {
  name: String
  size: number = 8
  readonly rooms: Array<Screen>

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

  constructor() {
    this.zones = [];
  }
}
