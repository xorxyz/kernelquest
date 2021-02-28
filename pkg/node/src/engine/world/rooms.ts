import { Matrix, matrixOf, Vector } from '../../../lib/math';
import { Environment } from '../../shell/types';
import { Agent } from '../agents/agents';
import { Block } from '../things/blocks';
import { Item } from '../things/items';
import { Cell } from './cells';

export type Layout = Array<string>

export class Room extends Environment {
  name: string
  cells: Matrix<Cell>
  blocks: Array<Block> = []
  agents: Array<Agent> = []
  items: Array<Item> = []

  constructor() {
    super();
    this.cells = matrixOf(16, 10, (x, y) => new Cell(x, y));
  }

  collides(v: Vector) {
    return (
      !this.blocks.some((w) => w.position.equals(v)) &&
      !this.agents.some((a) => a.position.equals(v))
    );
  }

  add(agent: Agent, x: number, y: number) {
    this.agents.push(agent);
    this.move(agent, x, y);
  }

  remove(agent: Agent) {
    this.agents.splice(this.agents.findIndex((a) => a === agent));
  }

  move(agent: Agent, x: number, y: number) {
    const from = agent.position;
    const oldCell = this.cells[from.y][from.x];
    oldCell.agent = null;

    const newCell = this.cells[y][x];
    newCell.agent = agent;

    agent.position.setXY(x, y);
  }

  static from(layout: Array<string>) {
    const room = new Room();

    room.cells.forEach((row) => {
      row.forEach((cell) => {
        const bg = layout[cell.position.y].slice(
          cell.position.x * 2, cell.position.x * 2 + 2,
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
  '....--..........................',
  '................................',
  '..🌵............................',
  '....................__..........',
  '................................',
  '..........__....................',
  '................................',
  '............................__..',
  '................................',
  '..__............................',
]);
