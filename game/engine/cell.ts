import { Colors, esc, Style } from 'xor4-lib/esc';
import { DirectionName, Directions, EastVector, NorthVector, SouthVector, Vector, WestVector } from 'xor4-lib/math';
import { EAST, NORTH, SOUTH, WEST } from 'xor4-lib/directions';
import { Agent, Foe } from './agents';
import { Place } from './places';
import { Thing } from './things';
import { EMPTY_CELL_CHARS } from '../constants';

export class Glyph {
  private chars: string;

  static Empty = '..';

  get value() {
    return this.chars;
  }

  constructor(chars: string = EMPTY_CELL_CHARS) {
    this.chars = chars;
  }
}

export class Port {
  slot: Thing;
}

export interface IPorts {
  north: Cell
  east: Cell
  south: Cell
  west: Cell
}

export class Cell {
  public position: Vector;
  public glyph: Glyph = new Glyph();
  public slot: Agent | Thing | null = null;
  public buffer: Agent | Thing | null = null;

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  public get isBlocked() {
    return (
      this.slot instanceof Agent ||
      (this.slot instanceof Thing && this.slot.isBlocking)
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

  render(ctx: Place, tick: number) {
    const glyph = this.slot?.render() || this.glyph.value;
    const style = ctx.findAgentsWithCell(this).filter((agent) => agent.isAlive).length
      ? esc(Colors.Bg.Blue) + esc(Colors.Fg.Black)
      : esc(Colors.Bg.Black) + esc(Colors.Fg.White);

    return style + glyph + esc(Style.Reset);
  }

  isAdjacentTo(cell: Cell) {
    return (
      cell.position.clone().add(NorthVector).equals(this.position) ||
      cell.position.clone().add(EastVector).equals(this.position) ||
      cell.position.clone().add(SouthVector).equals(this.position) ||
      cell.position.clone().add(WestVector).equals(this.position)
    );
  }

  relativeHeading(cell: Cell): Vector | null {
    if (!this.isAdjacentTo(cell)) return null;

    const diff = this.position.clone().sub(cell.position);
    const direction = [NORTH, EAST, SOUTH, WEST].find((vector) => vector.equals(diff));

    return direction || null;
  }
}
