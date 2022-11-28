import {
  Rectangle,
  Vector,
  AREA_HEIGHT,
  AREA_WIDTH,
  Colors,
  esc,
  Style,
  Direction,
} from '../shared';
import { Agent } from './agent';
import { Cell } from './cell';
import { BodyType, Thing } from './thing';
import { Door } from './things';

/** @category Area */
const CELL_COUNT = AREA_WIDTH * AREA_HEIGHT;

export class AreaBody extends BodyType {}

/** @category Area */
export class Area {
  static bounds = new Rectangle(new Vector(0, 0), new Vector(AREA_WIDTH, AREA_HEIGHT));

  readonly position: Vector;
  readonly timeLimit: number = 700;

  public name: string = 'area';

  public tick: number = 0;
  public seconds: number = 0;

  public flags: Set<Thing> = new Set();
  public capturedFlags: Set<Thing> = new Set();

  public crowns: Set<Thing> = new Set();
  public capturedCrowns: Set<Thing> = new Set();

  public doors: Set<Door> = new Set();
  public outerRectangle: Rectangle;

  private innerRectangle: Rectangle;
  private cells: Array<Cell>;
  public agents: Set<Agent> = new Set();
  private things: Set<Thing> = new Set();
  private areas: Set<Area> = new Set();
  private rows: Array<Array<Cell>> = new Array(AREA_HEIGHT).fill(0).map(() => []);
  private setupFn?: (this: Area) => void;

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

  constructor(x: number, y: number, setupFn?: (this: Area) => void) {
    this.position = new Vector(x, y);
    this.cells = new Array(CELL_COUNT).fill(0).map((_, i) => {
      const cellY = Math.floor(i / AREA_WIDTH);
      const cellX = i - (AREA_WIDTH * cellY);

      return new Cell(cellX, cellY);
    });

    this.cells.forEach((cell) => this.rows[cell.position.y].push(cell));

    this.outerRectangle = new Rectangle(this.position, new Vector(AREA_WIDTH, AREA_HEIGHT));
    this.innerRectangle = new Rectangle(
      this.outerRectangle.position.clone().addX(1).addY(1),
      this.outerRectangle.size.clone().subX(2).subY(2),
    );

    if (setupFn) {
      this.setupFn = setupFn;
      this.setupFn();
    }
  }

  clear() {
    this.cells.forEach((cell) => cell.clear());
    this.agents.clear();
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

  search(str: string) {
    const all = [...this.agents, ...this.things, ...this.areas];

    return all.filter((x) => x.name.includes(str));
  }

  find(thing: Agent | Thing): Cell | null {
    return this.cells.find((cell) => cell.slot === thing) || null;
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
    if (!Area.bounds.contains(position)) return null;
    const index = position.y * AREA_WIDTH + position.x;
    return this.cells[index];
  }

  getCellNeighbours(cell: Cell, direction: Direction): Array<Cell | null> {
    return [
      this.cellAt(cell.position.clone().add(direction.value)),
      this.cellAt(cell.position.clone().add(direction.rotateRight().value)),
      this.cellAt(cell.position.clone().add(direction.rotateRight().value)),
      this.cellAt(cell.position.clone().add(direction.rotateRight().value)),
    ].filter((x) => x);
  }

  findAgentsFacingCell(cell: Cell): Array<Agent> {
    return Array.from(this.agents).filter((agent) => agent.facing.cell === cell);
  }

  reset() {
    this.clear();
    if (this.setupFn) this.setupFn();
  }

  contains(vector: Vector) { return this.innerRectangle.contains(vector); }

  childrenContain(vector: Vector) {
    return Array.from(this.areas).some((area) => area.contains(vector));
  }

  list() {
    return [
      ...Array.from(this.agents),
      ...Array.from(this.things),
      ...Array.from(this.areas),
    ];
  }
}
