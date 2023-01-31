import {
  Vector, EMPTY_CELL_CHARS, EAST, NORTH, SOUTH, WEST, Colors, esc, Style,
} from '../shared';
import { Agent, Foe } from './agent';
import { Area, WorldMap } from './area';
import { Thing } from './thing';

/** @category Cell */
export class Glyph {
  private chars: string;

  static Empty = esc(Style.Dim) + EMPTY_CELL_CHARS + esc(Style.Reset);

  get value() {
    return this.chars;
  }

  constructor(chars: string = EMPTY_CELL_CHARS) {
    this.chars = chars;
  }
}

/** @category Cell */
export class Cell {
  public position: Vector;
  public slot: Agent | Thing | null = null;
  public buffer: Agent | Thing | null = null;
  public mark: number | null = null;

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  get id() {
    return 1 + this.position.y * 16 + this.position.x;
  }

  public get isBlocked() {
    return (
      this.slot instanceof Agent
      || (this.slot instanceof Thing && this.slot.type.isBlocking)
    );
  }

  containsFoe(): boolean {
    return this.slot instanceof Agent && this.slot.type instanceof Foe;
  }

  /* Empty the cell's slot. */
  clear() {
    this.slot = null;
    this.erase();
  }

  /* Take the thing that's in the cell's slot. */
  take(): Agent | Thing | null {
    if (!this.slot) return null;

    const thing = this.slot;

    if (this.buffer) {
      this.slot = this.buffer;
      this.buffer = null;
    } else {
      this.slot = null;
    }

    return thing;
  }

  /* Put a thing in the cell's slot. */
  put(thing: Agent | Thing): boolean {
    if (this.slot && this.buffer) return false;
    if (this.slot) {
      this.buffer = this.slot;
    }

    this.slot = thing;

    return true;
  }

  render(ctx: Area) {
    if ((ctx.findAgentsFacingCell(this).filter((agent) => agent.isAlive).length)
    && !(ctx instanceof WorldMap)) {
      return esc(Colors.Bg.Cyan)
      + esc(Colors.Fg.Black)
      + (this.slot?.type.glyph.value || this.renderMark() || Glyph.Empty)
      + esc(Style.Reset);
    }
    return this.slot?.render() || this.renderMark() || Glyph.Empty;
  }

  isAdjacentTo(cell: Cell) {
    return (
      cell.position.clone().add(NORTH).equals(this.position)
      || cell.position.clone().add(EAST).equals(this.position)
      || cell.position.clone().add(SOUTH).equals(this.position)
      || cell.position.clone().add(WEST).equals(this.position)
    );
  }

  relativeHeading(cell: Cell): Vector | null {
    if (!this.isAdjacentTo(cell)) return null;

    const diff = this.position.clone().sub(cell.position);
    const direction = [NORTH, EAST, SOUTH, WEST].find((vector) => vector.equals(diff));

    return direction || null;
  }

  renderMark() {
    return this.mark?.toString(16).slice(-2).padStart(2, '0');
  }

  scratch(n: number) {
    this.mark = n;
  }

  erase() {
    this.mark = null;
  }
}
