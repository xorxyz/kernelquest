import * as fs from 'fs';
import { promisify } from 'util';
import { Vector } from '../../lib/math';
import { Stack } from '../../lib/stack';
import { Agent } from './agents';
import { Program, Thing } from './things';
import { DB_FILEPATH, MAX_X, MAX_Y } from './constants';
import { esc, Style } from '../../lib/esc';

export type Memory = Array<Thing>
export type DataStack = Stack<Thing>

const empty = `${esc(Style.Dim)}..`;

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export interface Ports<T> {
  north: T, east: T, south: T, west: T
}

export class Cell {
  position: Vector
  ports: Ports<Cell>
  data: Thing | null = null
  program: Program | null = null

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  render() {
    return this.data?.appearance || empty;
  }
}

export class Row extends Array<Cell> {
  constructor(y: number) {
    super();
    this.length = MAX_X + 1;

    for (let x = 0; x < this.length; x++) {
      this[x] = new Cell(x, y);
    }
  }
}

export class Col extends Array {
  constructor(rows: Array<Row>, x: number) {
    super();
    this.length = MAX_Y + 1;
    this.fill(0).forEach((_, y) => {
      this[y] = rows[y][x];
    });
  }
}

export class Room {
  readonly position: Vector
  ports: Ports<Room>
  rows: Array<Row>
  cols: Array<Col>
  private agents: Set<Agent> = new Set()

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);

    this.rows = new Array(MAX_Y + 1).fill(0)
      .map((_, n) => new Row(n));

    this.cols = new Array(MAX_X + 1).fill(0)
      .map((_, n) => new Col(this.rows, n));
  }

  find(agent: Agent) {
    return this.agents.has(agent);
  }

  add(agent: Agent) {
    this.agents.add(agent);
    agent.teleport(0, 0, this.viewAs());
  }

  remove(agent: Agent) {
    this.agents.delete(agent);
  }

  scan() {}

  viewAs() {
    return new Proxy(this, {
    });
  }
}

export class Zone {
  name: string
  rooms: Array<Array<Room>>

  constructor(name: string) {
    this.name = name;
    this.rooms = new Array(16).fill(0).map((_, y) => {
      const row = new Array(10).fill(0).map((__, x) => new Room(x, y));
      return row;
    });
  }

  find(agent: Agent): Room | null {
    let room: Room | null = null;

    this.rooms.forEach((a) => a.forEach((b) => {
      if (b.find(agent)) {
        room = b;
      }
    }));

    return room;
  }

  add(agent: Agent, coord: Vector = new Vector(0, 0)) {
    this.rooms[coord?.y || 0][coord.x].add(agent);
  }

  remove(agent: Agent, coord: Vector = new Vector(0, 0)) {
    this.rooms[coord?.y || 0][coord.x].add(agent);
  }
}

export class World {
  admins: Set<Agent> = new Set()
  mods: Set<Agent> = new Set()
  players: Set<Agent> = new Set()

  map: Map<Agent, Room>
  zones: Array<Zone> = []

  constructor() {
    ['overworld'].forEach((name) => this.zones.push(new Zone(name)));
  }

  get defaultZone() {
    return this.zones[0];
  }

  async load() {
    const contents = await readFile(DB_FILEPATH, 'utf8');

    return contents;
  }

  async save(contents) {
    await writeFile(DB_FILEPATH, contents);
  }
}
