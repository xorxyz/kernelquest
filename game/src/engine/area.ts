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

  public id: number;
  public name = 'area';

  public tick = 0;
  public seconds = 0;

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
    this.id = y * 16 + x;
    this.position = new Vector(x, y);
    this.cells = new Array(CELL_COUNT).fill(0).map((_, i) => {
      const cellY = Math.floor(i / AREA_WIDTH);
      const cellX = i - (AREA_WIDTH * cellY);

      return new Cell(cellX, cellY);
    });

    this.cells.forEach((cell) => this.rows[cell.position.y].push(cell));

    this.cells[0].scratch(this.id);

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
    this.update();
  }

  has(agent: Agent): boolean {
    return this.cells.some((cell) => cell.slot instanceof Agent && cell.slot.id === agent.id);
  }

  put(entity: Agent | Thing, position?: Vector) {
    if (position) entity.position.copy(position);

    const cell = this.cellAt(entity.position);

    if (!cell) return false;

    cell.slot = entity;

    if (entity instanceof Agent) {
      this.agents.add(entity);

      entity.facing.cell = this.cellAt(entity.isLookingAt);
      entity.pwd = this.id;
    }

    if (entity instanceof Thing) {
      this.things.add(entity);
    }

    this.update();

    return true;
  }

  update() {
    this.things.forEach((t) => t.update(this));
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

    this.update();

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

  list(): Array<Agent|Thing> {
    return [...this.agents.values(), ...this.things.values()].sort((a, b) => a.id - b.id);
  }

  findAgentById(agentId: number): Agent | null {
    const agent = [...this.agents.values()].find((a) => a.id === agentId);

    return agent || null;
  }

  findThingById(thingId: number): Thing | null {
    const thing = [...this.things.values()].find((a) => a.id === thingId);

    return thing || null;
  }

  findCellById(cellId: number): Cell | null {
    const cell = this.cells.find((c) => c.id === cellId);

    return cell || null;
  }

  findBodyById(id:number): Agent | Thing | Cell | null {
    return this.findAgentById(id) || this.findThingById(id) || this.findCellById(id);
  }
}
