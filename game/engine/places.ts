import { Rectangle, Vector } from 'xor4-lib/math';
import { EventEmitter } from 'events';
import { Colors, esc, Style } from 'xor4-lib/esc';
import { Agent, Hero } from './agents';
import { Cell, Glyph } from './cell';
import { ROOM_HEIGHT, ROOM_WIDTH } from '../constants';
import { ActionFailure, ActionSuccess } from './actions';
import { Thing } from './things';

const CELL_COUNT = ROOM_WIDTH * ROOM_HEIGHT;

export class Wall extends Thing {
  name = 'wall';
  appearance = '##';
  isStatic = true;
  render(): string {
    return (
      esc(Colors.Bg.Gray) + esc(Colors.Fg.Black) +
      this.appearance +
      esc(Style.Reset)
    );
  }
}

export class Door extends Thing {
  public name = 'door';
  public appearance = '++';
  readonly isStatic = true;
  private place: Place;

  constructor(place: Place, position: Vector) {
    super();
    this.place = place;
    this.position.copy(position);
  }

  access(): Place {
    return this.place;
  }

  render(): string {
    return esc(Colors.Bg.White) + esc(Colors.Fg.Black) + this.appearance + esc(Style.Reset);
  }
}

export class Place extends EventEmitter {
  static bounds = new Rectangle(new Vector(0, 0), new Vector(ROOM_WIDTH, ROOM_HEIGHT));
  readonly position: Vector;
  public doors: Set<Door> = new Set();
  public outerRectangle: Rectangle;
  private innerRectangle: Rectangle;
  private cells: Array<Cell>;
  private agents: Set<Agent> = new Set();
  private places: Set<Place> = new Set();
  private rows: Array<Array<Cell>> = new Array(ROOM_HEIGHT).fill(0).map(() => []);
  private setupFn?: (this: Place) => void;

  constructor(x: number, y: number, outerRectangle: Rectangle, setupFn?: (this: Place) => void) {
    super();

    this.position = new Vector(x, y);
    this.cells = new Array(CELL_COUNT).fill(0).map((_, i) => {
      const cellY = Math.floor(i / ROOM_WIDTH);
      const cellX = i - (ROOM_WIDTH * cellY);

      return new Cell(cellX, cellY);
    });

    this.cells.forEach((cell) => this.rows[cell.position.y].push(cell));

    this.outerRectangle = outerRectangle;
    this.innerRectangle = new Rectangle(
      outerRectangle.position.clone().addX(1).addY(1),
      outerRectangle.size.clone().subX(2).subY(2),
    );

    if (setupFn) {
      this.setupFn = setupFn;
      this.setupFn();
    }
  }

  update(tick: number) {
    this.agents.forEach((agent: Agent) => {
      if (!agent.isAlive) return;

      this.processTurn(agent, tick);
      this.applyVelocity(agent);
    });
  }

  private processTurn(agent: Agent, tick: number) {
    const action = agent.takeTurn(tick);

    if (action) {
      const result: ActionFailure | ActionSuccess = action?.tryPerforming(this, agent);
      if (result instanceof ActionFailure) {
        this.emit('action-failure', { agent, result });
      }
      if (result instanceof ActionSuccess) {
        this.emit('action-success', { agent, result });
      }
    }

    if (tick % 10 === 0) agent.sp.increase(1);
  }

  private applyVelocity(agent: Agent) {
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
      .map(((cell) => (
        rect && rect.contains(cell.position) && !this.childrenContain(cell.position)
          ? cell.render(this, tick)
          : `${esc(Colors.Bg.Black)}  ${esc(Style.Reset)}`)))
      .join(''));
  }

  cellAt(position: Vector): Cell | null {
    if (!Place.bounds.contains(position)) return null;
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

  build(house: Place, doors: Array<Door>) {
    this.places.add(house);
    this.cells.forEach((cell) => {
      if (!house.contains(cell.position) && house.outerRectangle.contains(cell.position)) {
        cell.slot = doors.find((door) => door.position.equals(cell.position)) || new Wall();
      }
    });
  }

  contains(vector: Vector) { return this.innerRectangle.contains(vector); }

  childrenContain(vector: Vector) {
    return Array.from(this.places).some((place) => place.contains(vector));
  }
}
