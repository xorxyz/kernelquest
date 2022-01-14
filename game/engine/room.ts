import { Rectangle, Vector } from 'xor4-lib/math';
import { EventEmitter } from 'events';
import { Agent, Hero } from './agents';
import { Cell, Glyph } from './cell';
import { ROOM_HEIGHT, ROOM_WIDTH } from '../constants';
import { ActionFailure, ActionSuccess } from './actions';
import { FAIL } from './events';

const CELL_COUNT = ROOM_WIDTH * ROOM_HEIGHT;

export class Room extends EventEmitter {
  static bounds = new Rectangle(new Vector(0, 0), new Vector(ROOM_WIDTH, ROOM_HEIGHT));
  public position: Vector;
  private cells: Array<Cell>;
  private agents: Set<Agent> = new Set();
  private rows: Array<Array<Cell>> = new Array(ROOM_HEIGHT).fill(0).map(() => []);
  private setupFn?: (this: Room) => void;

  constructor(x: number, y: number, setupFn?: (this: Room) => void) {
    super();
    this.position = new Vector(x, y);
    this.cells = new Array(CELL_COUNT).fill(0).map((_, i) => {
      const cellY = Math.floor(i / ROOM_WIDTH);
      const cellX = i - (ROOM_WIDTH * cellY);

      return new Cell(cellX, cellY);
    });
    this.cells.forEach((cell) => this.rows[cell.position.y].push(cell));

    if (setupFn) {
      this.setupFn = setupFn;
      this.setupFn();
    }
  }

  update(tick: number) {
    this.agents.forEach((agent: Agent) => {
      if (!agent.isAlive) return;
      const action = agent.takeTurn(tick);

      if (action) {
        const authorized = action?.authorize(agent);
        if (authorized) {
          const result = action?.perform(this, agent);
          if (result instanceof ActionFailure) {
            this.emit('action-failure', { agent, result });
          }
          if (result instanceof ActionSuccess) {
            this.emit('action-success', { agent, result });
          }
        } else {
          this.emit(FAIL, { agent });
          this.emit('action-failure', { agent, result: new ActionFailure('Not enough stamina.') });
        }
      }

      if (tick % 10 === 0) agent.sp.increase(1);
      if (agent.body.velocity.isZero()) return;

      const next = agent.body.position.clone().add(agent.body.velocity);
      const target = this.cellAt(next);

      if (target && !target.isBlocked) {
        const previous = this.cellAt(agent.body.position);
        if (previous) previous.slot = null;
        target.slot = agent;
        agent.body.position.add(agent.body.velocity);
        agent.cell = this.cellAt(agent.body.isLookingAt);
      }

      agent.body.velocity.setXY(0, 0);
    });
  }

  clear() {
    this.cells.forEach((cell) => cell.clear());
    this.agents.clear();
  }

  load(cells: Array<Cell>) {
    this.cells.forEach((cell, i) => {
      cell.glyph = new Glyph(cells[i].glyph.value);
    });
  }

  has(agent: Agent): boolean {
    return this.cells.some((cell) => cell.slot === agent);
  }

  add(agent: Agent, position?: Vector) {
    if (position) agent.body.position.copy(position);

    const cell = this.cellAt(agent.body.position);

    if (!cell) return false;

    cell.slot = agent;
    this.agents.add(agent);

    agent.cell = this.cellAt(agent.body.isLookingAt);

    return true;
  }

  find(agent: Agent): Cell | null {
    return this.cells.find((cell) => cell.slot === agent) || null;
  }

  findPlayers(): Array<Hero> {
    return Array.from(this.agents).filter((agent) => agent instanceof Hero) as Array<Hero>;
  }

  remove(agent: Agent) {
    const cell = this.cells.find((c) => c.slot === agent);
    if (cell) {
      cell.slot = null;
    }

    this.agents.delete(agent);

    return true;
  }

  render(tick: number, rect?: Rectangle): Array<string> {
    return this.rows.map((row) => row
      .map(((cell) => (rect && rect.contains(cell.position)
        ? cell.render(this, tick)
        : '  ')))
      .join(''));
  }

  cellAt(position: Vector): Cell | null {
    if (!Room.bounds.contains(position)) return null;
    const index = position.y * ROOM_WIDTH + position.x;
    return this.cells[index];
  }

  findAgentsWithCell(cell: Cell): Array<Agent> {
    return Array.from(this.agents).filter((agent) => agent.cell === cell);
  }

  reset() {
    this.emit('reset');
    this.clear();
    if (this.setupFn) this.setupFn();
  }
}
