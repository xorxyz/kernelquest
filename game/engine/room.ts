import { Rectangle, Vector } from 'xor4-lib/math';
import { debug } from 'xor4-lib/logging';
import { Agent } from './agents';
import { Cell, Port } from './cell';
import { ROOM_HEIGHT, ROOM_WIDTH } from '../constants';

const CELL_COUNT = ROOM_WIDTH * ROOM_HEIGHT;

export class Room {
  static bounds = new Rectangle(new Vector(0, 0), new Vector(ROOM_WIDTH, ROOM_HEIGHT));

  public ports: Array<Port> = [];
  public position: Vector;

  private cells: Array<Cell>;
  private agents: Set<Agent> = new Set();
  private rows: Array<Array<Cell>>;
  private cellsByXY: Record<string, Cell> = {};

  constructor(x: number, y: number) {
    debug('constructing a room');
    this.position = new Vector(x, y);
    this.rows = new Array(ROOM_HEIGHT).fill(0).map(() => []);

    this.cells = new Array(CELL_COUNT).fill(0).map((_, i) => {
      const cellY = Math.floor(i / ROOM_WIDTH);
      const cellX = i - (ROOM_WIDTH * cellY);

      return new Cell(cellX, cellY);
    });

    this.cells.forEach((cell) => {
      this.rows[cell.position.y].push(cell);
      this.cellsByXY[cell.name] = cell;
    });
  }

  update() {
    this.cells.forEach((cell) => {
      cell.update();
    });

    this.agents.forEach((agent: Agent) => {
      const action = agent.takeTurn();

      if (action && action.authorize(agent)) {
        action.perform(this, agent);
        debug('agent of type', agent.type.name, 'performed:', action.name);
      } else {
        agent.sp.increase(1);
      }
    });
  }

  clear() {
    this.cells.forEach((cell) => cell.clear());
    this.agents.clear();
  }

  load(cells: Array<Cell>) {
    this.cells.forEach((cell, i) => cell.write(cells[i].read()));
  }

  has(agent: Agent): boolean {
    return this.cells.some((cell) => cell.has(agent));
  }

  add(agent: Agent, position?: Vector): Room {
    if (position) {
      agent.body.position.copy(position);
    }

    const cell = this.cellAt(position || agent.body.position);

    cell.enter(agent);
    this.agents.add(agent);

    agent.handleCell(this.cellAt(agent.body.isLookingAt));

    return this;
  }

  find(agent: Agent): Cell | null {
    return this.cells.find((cell) => cell.has(agent)) || null;
  }

  remove(agent: Agent): Room {
    const cell = this.cells.find((c) => c.has(agent));
    if (cell) cell.leave();
    else {
      console.log('cant find cell with agent');
    }

    this.agents.delete(agent);

    return this;
  }

  render(): Array<string> {
    const arr = this.rows.map((row) => row.map((cell) => cell.render(this)).join(''));
    return arr;
  }

  cellAt(position: Vector): Cell {
    const index = position.y * ROOM_WIDTH + position.x;
    return this.cells[index];
  }

  cellIsHeld(cell: Cell): boolean {
    const agents = Array.from(this.agents).find((agent) => agent.hasHandle(cell));

    return agents !== undefined;
  }

  collides(position: Vector) {
    return !Room.bounds.contains(position) || this.cellAt(position).isBlocked;
  }
}
