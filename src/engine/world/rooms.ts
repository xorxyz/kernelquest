import { debug } from '../../../lib/logging';
import { Matrix, matrixOf, Vector } from '../../../lib/math';
import { Environment } from '../../shell/types';
import { Agent } from '../agents/agents';
import { Command, Drop, Move, Drag, PickUp, Rotate } from '../agents/commands';
import { Block } from '../things/blocks';
import { Item } from '../things/items';
import { Cell } from './cells';

const MESSAGE_TTL = 80;

export type Layout = Array<string>

export interface IMessage {
  text: string,
  countdown: number
}

export class Room extends Environment {
  name: string
  cells: Matrix<Cell>

  blocks: Array<Block> = []
  agents: Array<Agent> = []
  items: Array<Item> = []

  messages: Map<Agent, IMessage> = new Map()

  round: number

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

  say(agent: Agent, message: string) {
    this.messages.set(agent, {
      text: message,
      countdown: MESSAGE_TTL,
    });
  }

  collides(v: Vector) {
    return (
      this.blocks.some((w) => w.position.equals(v)) ||
      this.agents.some((a) => a.position.equals(v))
    );
  }

  add(agent: Agent, x: number, y: number) {
    debug('added:', agent.name, 'at:', x, y);
    this.agents.push(agent);
    this.setAgentPosition(agent, x, y);
  }

  remove(agent: Agent) {
    debug('removed:', agent.name, 'from:', agent.model.room.name);
    const cell = this.cells[agent.position.y][agent.position.x];
    cell.agent = null;
    this.agents.splice(this.agents.findIndex((a) => a === agent));
  }

  setAgentPosition(agent: Agent, x: number, y: number) {
    const from = agent.position;
    const oldCell = this.cells[from.y][from.x];
    const newCell = this.cells[y][x];

    oldCell.agent = null;
    newCell.agent = agent;

    agent.position.setXY(x, y);
  }

  setDraggedItemPosition(agent: Agent) {
    if (!agent.dragging) return;
    const from = agent.dragging.position;
    const to = agent.position.clone().add(agent.facing);
    const oldCell = this.cells[from.y][from.x];
    const newCell = this.cells[to.y][to.x];

    agent.dragging.position.copy(to);
    oldCell.stack.pop();
    newCell.stack.push(agent.dragging);

    debug(oldCell.position);
  }

  move(agent: Agent, command?: Command) {
    if (command && command instanceof Move) command.execute(agent);
    if (this.collides(agent.nextPosition)) return;

    const { x, y } = agent.nextPosition;

    this.setAgentPosition(agent, x, y);

    if (agent.dragging) {
      this.setDraggedItemPosition(agent);
    }

    agent.velocity.sub(agent.velocity);
  }

  update(round: number) {
    this.round = round;

    this.messages.forEach((message, agent) => {
      // eslint-disable-next-line no-param-reassign
      message.countdown--;
      if (message.countdown < 1) {
        this.messages.delete(agent);
      }
    });

    this.agents.forEach((agent) => {
      if (!agent.queue.length) return;

      const command = agent.takeTurn();

      if (command instanceof Rotate) {
        command.execute(agent);
        this.setDraggedItemPosition(agent);
      }

      this.move(agent, command);

      if (command instanceof Move) return;

      debug('command:', agent.name, 'calls', command);

      if (command instanceof Drag) {
        if (agent.dragging) return;
        const pos = agent.position.clone().addX(command.x).addY(command.y);
        if (pos.x < 0 || pos.x > 15 || pos.y < 0 || pos.y > 9) return;
        const cell = agent.model.room.cells[pos.y][pos.x];
        const item = cell.stack.peek();
        if (!item) return;
        item.position.copy(cell.position);
        agent.drag(new Vector(command.x, command.y), item);
      }

      if (command instanceof Drop) {
        command.execute(agent, this.items);
      }

      if (command instanceof PickUp) {
        const cell = this.cells[agent.position.y][agent.position.x];
        const item = cell.stack.pop();
        if (item) {
          agent.items.push(item);
        }
      }
    });
  }
}

export class EmptyRoom extends Room {}

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
