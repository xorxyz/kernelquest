import {
  Rectangle, Vector, CLOCK_MS_DELAY, ROOM_HEIGHT, ROOM_WIDTH, Colors, esc, Style, Direction, debug,
} from 'xor4-lib';
import EventEmitter from 'events';
import { Agent, Hero } from './agent';
import { Cell, Glyph } from './cell';
import { Action } from './action';
import { Wall, Door, Thing } from './thing';

/** @category Place */
const CELL_COUNT = ROOM_WIDTH * ROOM_HEIGHT;

/** @category Place */
export class Place {
  static bounds = new Rectangle(new Vector(0, 0), new Vector(ROOM_WIDTH, ROOM_HEIGHT));

  readonly position: Vector;
  readonly timeLimit: number = 700;

  public tick: number = 0;
  public seconds: number = 0;

  public flags: Set<Thing> = new Set();
  public capturedFlags: Set<Thing> = new Set();

  public crowns: Set<Thing> = new Set();
  public capturedCrowns: Set<Thing> = new Set();

  public doors: Set<Door> = new Set();
  public outerRectangle: Rectangle;

  public events = new EventEmitter();

  private innerRectangle: Rectangle;
  private cells: Array<Cell>;
  private agents: Set<Agent> = new Set();
  private things: Set<Thing> = new Set();
  private places: Set<Place> = new Set();
  private rows: Array<Array<Cell>> = new Array(ROOM_HEIGHT).fill(0).map(() => []);
  private setupFn?: (this: Place) => void;

  get secondsLeft() {
    return this.timeLimit - this.seconds;
  }

  get size() { return this.outerRectangle.size; }

  getEast(): Vector {
    return this.position.clone()
      .addX(this.size.x - 1)
      .addY(Math.floor(this.size.y / 2));
  }

  getSouth(): Vector {
    return this.position.clone()
      .addX(Math.floor(this.size.x / 2))
      .addY(this.size.y - 1);
  }

  constructor(x: number, y: number, setupFn?: (this: Place) => void) {
    this.position = new Vector(x, y);
    this.cells = new Array(CELL_COUNT).fill(0).map((_, i) => {
      const cellY = Math.floor(i / ROOM_WIDTH);
      const cellX = i - (ROOM_WIDTH * cellY);

      return new Cell(cellX, cellY);
    });

    this.cells.forEach((cell) => this.rows[cell.position.y].push(cell));

    this.outerRectangle = new Rectangle(this.position, new Vector(ROOM_WIDTH, ROOM_HEIGHT));
    this.innerRectangle = new Rectangle(
      this.outerRectangle.position.clone().addX(1).addY(1),
      this.outerRectangle.size.clone().subX(2).subY(2),
    );

    if (setupFn) {
      this.setupFn = setupFn;
      this.setupFn();
    }
  }

  update(tick: number) {
    this.seconds = Math.trunc((tick * CLOCK_MS_DELAY) / 1000);
    this.agents.forEach((agent: Agent) => {
      this.processTurn(agent, tick);
      this.applyVelocity(agent);
      this.events.emit('update');
    });
  }

  private processTurn(agent: Agent, tick: number) {
    const actions: Array<Action> = [];
    let done = false;
    let cost = 0;

    while (!done && cost <= 1) {
      const action = agent.takeTurn(tick);
      if (!action) {
        done = true;
      } else {
        cost += action.cost;
        actions.push(action);
      }
    }

    if (actions.length) {
      debug('actions', actions);
      actions.forEach((action) => {
        const result = action.tryPerforming(this, agent);
        if (!result.message) return;
        agent.remember({
          tick,
          message: result.message,
        });
      });
    }

    if (tick % 10 === 0) agent.sp.increase(1);
  }

  private applyVelocity(agent: Agent) {
    if (agent.velocity.isZero()) return;

    const next = agent.position.clone().add(agent.velocity);
    const target = this.cellAt(next);

    if (target && !target.isBlocked) {
      const previous = this.cellAt(agent.position);
      if (previous) previous.slot = null;
      target.slot = agent;
      agent.position.add(agent.velocity);
      agent.facing.cell = this.cellAt(agent.isLookingAt);
    }

    agent.velocity.setXY(0, 0);
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

  put(entity: Agent | Thing, position?: Vector) {
    if (position) entity.position.copy(position);

    const cell = this.cellAt(entity.position);

    if (!cell) return false;

    cell.slot = entity;

    if (entity instanceof Agent) {
      this.agents.add(entity);

      entity.facing.cell = this.cellAt(entity.isLookingAt);
    }

    if (entity instanceof Thing) {
      this.things.add(entity);
    }

    return true;
  }

  find(agent: Agent): Cell | null {
    return this.cells.find((cell) => cell.slot === agent) || null;
  }

  findPlayers(): Array<Agent> {
    return Array.from(this.agents).filter((agent) => agent.type instanceof Hero);
  }

  remove(entity: Agent | Thing) {
    const cell = this.cells.find((c) => c.slot === entity);

    if (!cell) { return false; }

    if (cell.slot instanceof Agent) {
      this.agents.delete(cell.slot);
    }

    if (cell.slot instanceof Thing) {
      this.things.delete(cell.slot);
    }

    cell.slot = null;

    return true;
  }

  render(rect?: Rectangle): Array<string> {
    return this.rows.map((row) => row
      .map(((cell) => (
        rect && rect.contains(cell.position) && !this.childrenContain(cell.position)
          ? cell.render(this)
          : `${esc(Colors.Bg.Black)}  ${esc(Style.Reset)}`)))
      .join(''));
  }

  cellAt(position: Vector): Cell | null {
    if (!Place.bounds.contains(position)) return null;
    const index = position.y * ROOM_WIDTH + position.x;
    return this.cells[index];
  }

  getCellNeighbours(cell: Cell, direction: Direction): Array<Cell | null> {
    return [
      this.cellAt(cell.position.clone().add(direction.value)),
      this.cellAt(cell.position.clone().add(direction.rotate().value)),
      this.cellAt(cell.position.clone().add(direction.rotate().value)),
      this.cellAt(cell.position.clone().add(direction.rotate().value)),
    ];
  }

  findAgentsWithCell(cell: Cell): Array<Agent> {
    return Array.from(this.agents).filter((agent) => agent.facing.cell === cell);
  }

  reset() {
    this.events.emit('reset');
    this.clear();
    if (this.setupFn) this.setupFn();
  }

  build(house: Place, doors: Array<Thing>) {
    this.places.add(house);
    this.cells.forEach((cell) => {
      if (!house.contains(cell.position) && house.outerRectangle.contains(cell.position)) {
        cell.slot = doors.find((door) => door.position.equals(cell.position)) ||
          new Thing(new Wall());
      }
    });
  }

  contains(vector: Vector) { return this.innerRectangle.contains(vector); }

  childrenContain(vector: Vector) {
    return Array.from(this.places).some((place) => place.contains(vector));
  }
}
