import { Matrix, matrixOf } from '../../../lib/math';
import { Agent } from '../agents/agents';
import { Cell } from './cells';

export type Layout = Array<string>

export class Room {
  name: string
  readonly cells: Matrix<Cell>
  readonly actors: Array<Agent>

  constructor() {
    this.cells = matrixOf(10, (x, y) => new Cell(x, y));
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
