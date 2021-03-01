import { Matrix, matrixOf, Vector } from '../../../lib/math';
import { Environment } from '../../shell/types';
import { Agent } from '../agents/agents';
import { Command, Drop, Move, PickUp } from '../agents/commands';
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

  private round: number

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

  constructor() {
    super();
    this.cells = matrixOf(16, 10, (x, y) => new Cell(x, y));
  }

  collides(v: Vector) {
    return (
      this.blocks.some((w) => w.position.equals(v)) ||
      this.agents.some((a) => a.position.equals(v))
    );
  }

  add(agent: Agent, x: number, y: number) {
    this.agents.push(agent);
    this.setPosition(agent, x, y);
  }

  remove(agent: Agent) {
    this.agents.splice(this.agents.findIndex((a) => a === agent));
  }

  setPosition(agent: Agent, x: number, y: number) {
    const from = agent.position;
    const oldCell = this.cells[from.y][from.x];
    const newCell = this.cells[y][x];

    oldCell.agent = null;
    newCell.agent = agent;

    agent.position.setXY(x, y);
  }

  move(agent: Agent, command?: Command) {
    if (this.collides(agent.nextPosition)) return;
    if (command && command instanceof Move) command.execute(agent);

    const { x, y } = agent.nextPosition;

    this.setPosition(agent, x, y);

    agent.velocity.sub(agent.velocity);
  }

  update(round: number) {
    this.round = round;

    this.agents.forEach((agent) => {
      if (!agent.queue.length) return;

      const command = agent.takeTurn();

      this.move(agent, command);

      if (command instanceof Drop) {
        command.item.position.setXY(agent.position.x, agent.position.y);
        command.execute(agent, this.items);
      }

      if (command instanceof PickUp) {
        this.items.forEach((item) => {
          if (agent.position.equals(item.position)) {
            agent.stack.push(item);
            this.items.splice(this.items.findIndex((i) => i === item));
          }
        });
      }
    });
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
