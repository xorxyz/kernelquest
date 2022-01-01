import { Vector } from 'xor4-lib/math';
import { Stack } from 'xor4-lib/stack';
import { Colors, esc, Style } from 'xor4-lib/esc';
import { Thing } from './things';
import { Agent, Cursor } from './agents';
import { bounds, ROOM_HEIGHT, ROOM_WIDTH } from '../constants';

export type Memory = Array<Thing>
export type DataStack = Stack<Thing>

const empty: string = '..';

export interface Ports<T> {
  north: T, east: T, south: T, west: T
}

export class Port {
  stack: Stack<Thing>;
}

export class Tile {
  chars: string;
}

export class Cell extends Thing {
  name: string;
  ports: Array<Port> = [];
  owner: Agent | null = null;
  readonly position: Vector;
  readonly tile: Tile = new Tile();
  readonly items: Stack<Thing> = new Stack<Thing>();
  readonly agents: Stack<Agent> = new Stack<Agent>();

  constructor(x: number, y: number) {
    super();
    this.position = new Vector(x, y);
    this.name = String(x) + String(y);
  }

  private get north() { return this.ports[0]; }
  private get east() { return this.ports[1]; }
  private get south() { return this.ports[2]; }
  private get west() { return this.ports[3]; }

  private get top() { return this.north?.stack.peek(); }
  private get right() { return this.east?.stack.peek(); }
  private get bottom() { return this.south?.stack.peek(); }
  private get left() { return this.west?.stack.peek(); }

  update() {
    if (this.top && this.bottom) {
      // vertical collision
    } else if (this.top) {
      this.pass(this.north, this.south);
    } else if (this.bottom) {
      this.pass(this.south, this.north);
    }

    if (this.left && this.right) {
      // horizontal collision
    } else if (this.left) {
      this.pass(this.west, this.east);
    } else if (this.right) {
      this.pass(this.east, this.west);
    }
  }

  has(agent: Agent) {
    return this.agents.some((a) => a === agent);
  }

  add(agent: Agent) {
    this.agents.push(agent);
    agent.cell = this;
  }

  remove(agent: Agent) {
    const index = this.agents.findIndex((a) => a === agent);
    if (index > -1) {
      this.agents.splice(index);
      return true;
    }
    return false;
  }

  render() {
    const glyph = (
      this.agents.peek()?.type.appearance ||
      this.items.peek()?.appearance ||
      (this.owner?.holding?.appearance) || empty
    );

    let style = esc(Colors.Bg.Black) + esc(Colors.Fg.White);

    if (this.owner && !(this.owner instanceof Cursor)) {
      style = esc(Colors.Bg.Blue) + esc(Colors.Fg.Black);
    }

    return style + glyph + esc(Style.Reset);
  }

  private pass(portA: Port, portB: Port) {
    const thing: Thing | undefined = portA.stack.pop();

    if (!thing) return;

    portB.stack.push(thing);
  }
}

export class Room extends Thing {
  name = 'room';
  readonly agents: Set<Agent> = new Set();
  readonly position: Vector;
  readonly rows: Array<Array<Cell>>;
  readonly cells: Array<Cell>;
  readonly cellsByXY: Record<string, Cell> = {};
  readonly ports: Array<Port> = [];

  constructor(x: number, y: number) {
    super();
    this.position = new Vector(x, y);
    this.rows = new Array(ROOM_HEIGHT).fill(0).map(() => []);
    this.cells = new Array(ROOM_WIDTH * ROOM_HEIGHT).fill(0).map((_, i) => {
      const y = Math.floor(i / ROOM_WIDTH);
      const x = y * ROOM_WIDTH + (ROOM_WIDTH - 1);
      const cell = new Cell(x, y);

      this.rows[y].push(cell);
      this.cellsByXY[cell.name] = cell;

      return cell;
    });
  }

  load(cells: Array<Cell>) {
    this.cells.forEach((cell, i) => {
      cell.tile.chars = cells[i].tile.chars;
    });
  }

  has(agent: Agent): boolean {
    return this.cells.some((cell) => cell.has(agent));
  }

  add(agent: Agent): Room {
    const cell = this.cellAt(agent.position);

    cell.add(agent);
    agent.room = this;
    this.agents.add(agent);

    return this;
  }

  find(agent: Agent): Cell | null {
    return this.cells.find((cell) => cell.has(agent)) || null;
  }

  move(agent: Agent): Room {
    if (agent.velocity.isZero()) return this;

    agent.position.add(agent.velocity);
    if (this.collides(agent.position)) {
      agent.position.sub(agent.velocity);
    }

    const currentCell = agent.cell;
    const nextCell = this.cellAt(agent.position);

    agent.velocity.sub(agent.velocity);
    nextCell.add(agent);
    if (currentCell) currentCell.remove(agent);

    return this;
  }

  remove(agent: Agent): Room {
    const cell = this.cells.find((c) => c.has(agent));
    if (cell) cell.remove(agent);
    else {
      console.log('cant find cell with agent');
    }
    this.agents.delete(agent);

    return this;
  }

  render(): Array<string> {
    return this.rows.map((row) => row.map((cell) => cell.render()).join(''));
  }

  cellAt(position: Vector): Cell {
    const index = position.y * ROOM_WIDTH + position.x;
    return this.cells[index];
  }

  private collides(position: Vector) {
    return !bounds.contains(position) || this.cellAt(position).agents[0];
  }
}

export class World extends Thing {
  name: 'world';
  readonly rooms: Array<Room>;

  constructor() {
    super();
    this.rooms = new Array(ROOM_WIDTH * ROOM_HEIGHT).fill(0).map((_, i) => {
      const y = Math.floor(i / ROOM_WIDTH);
      const x = y * ROOM_WIDTH + (ROOM_WIDTH - 1);
      return new Room(x, y);
    });
  }

  find(agent: Agent): Room | null {
    return this.rooms.find((room) => room.has(agent)) || null;
  }
}
