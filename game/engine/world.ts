import * as fs from 'fs';
import { promisify } from 'util';
import { Vector } from '../../lib/math';
import { Stack } from '../../lib/stack';
import { Queue } from '../../lib/queue';
import { esc, Style } from '../../lib/esc';
import { Equipment, Item, Thing } from './things';
import { Agent } from './agents';
import { bounds, DB_FILEPATH, ROOM_HEIGHT, ROOM_WIDTH } from './constants';

export type Memory = Array<Thing>
export type DataStack = Stack<Thing>

const empty: string = `${esc(Style.Dim)}..`;

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export interface Ports<T> {
  north: T, east: T, south: T, west: T
}

export class Port {
  a: Queue<Thing>
  b: Queue<Thing>
}


export class Cell extends Thing {
  name = 'cell';
  readonly position: Vector
  readonly agents: Stack<Agent> = new Stack()
  readonly items: Stack<Item|Equipment> = new Stack()

  constructor(x: number, y: number) {
    super();
    this.position = new Vector(x, y);
  }

  has (agent: Agent) {
    return this.agents.some(a => a === agent);
  }

  add(agent: Agent) {
    this.agents.push(agent);
    agent.cell = this;
  }

  remove(agent: Agent) {
    const index = this.agents.findIndex(a => a === agent);
    if (index > -1) {
      this.agents.splice(index);
      return true;
    }
    return false
  }

  render() {
    return ( 
      this.agents.peek()?.type.appearance || 
      this.items.peek()?.type.appearance || empty );
  }
}

export class Room extends Thing {
  name = 'room'
  readonly agents: Set<Agent> = new Set()
  readonly position: Vector
  readonly rows: Array<Array<Cell>>
  private cells: Array<Cell>

  constructor(x: number, y: number) {
    super();
    this.position = new Vector(x, y);
    this.rows = new Array(ROOM_HEIGHT).fill(0).map(() => []);
    this.cells = new Array(ROOM_WIDTH * ROOM_HEIGHT).fill(0).map((_, i) => {
      const y = Math.floor(i / ROOM_WIDTH);
      const x = y * ROOM_WIDTH + (ROOM_WIDTH - 1);
      const cell = new Cell(x, y);
  
      this.rows[y].push(cell);
  
      return cell;
    })
  }

  has(agent: Agent): boolean {
    return this.cells.some(cell => cell.has(agent));
  }

  add(agent: Agent): Room {
    const cell = this.cellAt(agent.position);

    cell.add(agent);
    agent.room = this;
    this.agents.add(agent)

    return this;
  }

  find(agent: Agent): Cell | null {
    return this.cells.find(cell => cell.has(agent)) || null;
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
    currentCell.remove(agent);

    return this;
  }

  remove(agent: Agent): Room {
    const cell = this.cells.find(c => c.has(agent));
    if (cell) cell.remove(agent);
    this.agents.delete(agent)

    return this;
  }

  render(): Array<string> {
    return this.rows.map((row) => row.map(r => r.render()).join(''));
  }

  private cellAt (position: Vector): Cell {
    const index = position.y * ROOM_WIDTH + position.x;
    return this.cells[index];
  }

  private collides (position: Vector) {
    return !bounds.contains(position) || this.cellAt(position).agents[0];
  }
}

export class World extends Thing {
  name: 'world'
  readonly rooms: Array<Room>

  constructor() {
    super();
    this.rooms = new Array(ROOM_WIDTH * ROOM_HEIGHT).fill(0).map((_, i) => {
      const y = Math.floor(i / ROOM_WIDTH);
      const x = y * ROOM_WIDTH + (ROOM_WIDTH - 1)
      return new Room(x, y);
    });
  }

  find(agent: Agent): Room | null {
    return this.rooms.find(room => room.has(agent)) || null;
  }

  async load() {
    const contents = await readFile(DB_FILEPATH, 'utf8');

    return contents;
  }

  async save(contents) {
    await writeFile(DB_FILEPATH, contents);
  }
}
