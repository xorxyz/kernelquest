import {
  Vector, EMPTY_CELL_CHARS, EAST, NORTH, SOUTH, WEST, Colors, esc, Style,
} from 'xor4-lib';
import { Agent, Foe } from './agent';
import { Place } from './place';
import { Thing } from './thing';

/** @category Cell */
export class Glyph {
  private chars: string;

  static Empty = '  ';

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
  public glyph: Glyph = new Glyph();
  public slot: Agent | Thing | null;
  public buffer: Agent | Thing | null = null;

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  public get isBlocked() {
    return (
      this.slot instanceof Agent ||
      (this.slot instanceof Thing && this.slot.type.isBlocking)
    );
  }

  containsFoe(): boolean {
    return this.slot instanceof Agent && this.slot.type instanceof Foe;
  }

  update() {}

  /* Empty the cell's slot. */
  clear() {
    this.slot = null;
    this.glyph = new Glyph();
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

  render(ctx: Place) {
    if ((ctx.findAgentsWithCell(this).filter((agent) => agent.isAlive).length)) {
      return esc(Colors.Bg.Cyan) +
      esc(Colors.Fg.Black) + (this.slot?.type.glyph.value || this.glyph.value) + esc(Style.Reset);
    }
    return this.slot?.render() || this.glyph.value;
  }

  isAdjacentTo(cell: Cell) {
    return (
      cell.position.clone().add(NORTH).equals(this.position) ||
      cell.position.clone().add(EAST).equals(this.position) ||
      cell.position.clone().add(SOUTH).equals(this.position) ||
      cell.position.clone().add(WEST).equals(this.position)
    );
  }

  relativeHeading(cell: Cell): Vector | null {
    if (!this.isAdjacentTo(cell)) return null;

    const diff = this.position.clone().sub(cell.position);
    const direction = [NORTH, EAST, SOUTH, WEST].find((vector) => vector.equals(diff));

    return direction || null;
  }
}
