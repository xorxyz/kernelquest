import { Matrix, matrixOf } from '../../../lib/math';
import { Agent } from '../agents/agents';
import { Cell } from './cells';

export type Layout = Array<string>

export class Room {
  name: string
  cells: Matrix<Cell>
  actors: Array<Agent>

  constructor() {
    this.cells = matrixOf(16, 10, (x, y) => new Cell(x, y));
  }

  static from(layout: Array<string>) {
    const room = new Room();

    room.cells.forEach((row) => {
      row.forEach((cell) => {
        const bg = layout[cell.position.y].slice(
          cell.position.x, cell.position.x + 2,
        );
        // eslint-disable-next-line no-param-reassign
        cell.bg = bg;
      });
    });

    return room;
  }
}

export class EmptyRoom extends Room {}

export const otherRoom = Room.from([
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

export const testRoom = Room.from([
  '....aA.....................',
  '..........................',
  '..........................',
  '..........AAAAAAAAAAAAAAA........',
  '..........................',
  '..........................',
  '..........................',
  '..........................',
  '..........................',
  '..........................',
]);
