import { Vector } from '../../../lib/geom';
import { Stack } from '../../../lib/stack';
import { Actor } from '../actors/actors';
import { Item } from '../things/items';

export class Port {
  name: string
  constructor(name: string) {
    this.name = name;
  }
}

export const Ports = () => [
  new Port('n'), new Port('e'), new Port('s'), new Port('w'),
];

export class Cell {
  position: Vector
  bg: string
  stack: Stack<Item> = new Stack()
  ports: Array<Port> = Ports()
  actor?: Actor

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
    this.bg = '..';
  }
}

export type Layout = Array<string>
export type CellMatrix = Array<Array<Cell>>

export class Room {
  name: String
  readonly cells: CellMatrix
  readonly actors: Array<Actor>

  constructor() {
    this.cells = Array(10).fill(0).map((y) =>
      Array(10).fill(0).map((_, x) => new Cell(x, y)));
  }

  static from(layout: Layout) {
    const room = new Room();

    room.cells.forEach((row, y) => {
      row.forEach((cell, x) => {
        // eslint-disable-next-line no-param-reassign
        cell.bg = layout[x][y];
      });
    });

    return room;
  }
}

export class EmptyRoom extends Room {}

export const testRoom = Room.from([
  '....................',
  '..........-.........',
  '..🌵................',
  '....................',
  '.-..................',
  '....................',
  '....................',
  '...............-....',
  '....................',
  '......-.............',
]);
