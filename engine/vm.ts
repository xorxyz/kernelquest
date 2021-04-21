import * as fs from 'fs';
import { promisify } from 'util';
import { Vector } from '../lib/math';
import { Stack } from '../lib/stack';
import { Ref } from './language';
import { Agent } from './agents';
import { Thing } from './things';
import { DB_FILEPATH, MAX_X, MAX_Y } from './constants';

export type Memory = Array<Thing>
export type DataStack = Stack<Thing>

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export interface Ports<T> {
  north: T, east: T, south: T, west: T
}

export abstract class Context {
  position: Vector
  ports: Ports<Cell|Room>
  stack: DataStack = new Stack()

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }
}

export class Cell extends Context {
  ports: Ports<Cell>
  ref: Ref
  constructor(x: number, y: number, ref: Ref) {
    super(x, y);
    this.ref = ref;
  }
}

export class Row extends Array<Cell> {
  constructor(memory: Memory, y: number) {
    super();
    this.length = MAX_X + 1;

    for (let x = 0; x < this.length; x++) {
      const ref = new Ref(memory, x, y);
      const cell = new Cell(x, y, ref);

      this[x] = cell;
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

export class Room extends Context {
  ports: Ports<Room>
  memory: Memory = []

  rows: Array<Row>
  cols: Array<Col>

  agents: Set<Agent> = new Set()
  ownership: Map<Ref, Agent | null> = new Map()

  constructor(x: number, y: number) {
    super(x, y);
    this.rows = new Array(MAX_Y + 1).fill(0)
      .map((_, n) => new Row(this.memory, n));
    this.cols = new Array(MAX_X + 1).fill(0)
      .map((_, n) => new Col(this.rows, n));
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
}

export class World {
  zones: Set<Zone> = new Set()
  locations: Map<Agent, Room>

  constructor() {
    ['overworld', 'fountain', 'town',
    ].forEach((name) => this.zones.add(new Zone(name)));
  }

  async load() {
    const contents = await readFile(DB_FILEPATH, 'utf8');

    return contents;
  }

  async save(contents) {
    await writeFile(DB_FILEPATH, contents);
  }
}
