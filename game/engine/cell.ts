import { Colors, esc, Style } from 'xor4-lib/esc';
import { Vector } from 'xor4-lib/math';
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

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  public get isBlocked() {
    return this.slot !== null;
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
  take(): Thing | null {
    if (!this.slot || this.slot instanceof Agent) return null;
    const thing = this.slot;

    this.slot = null;

    return thing;
  }

  /* Put a thing in the cell's slot. */
  put(thing: Thing): boolean {
    if (this.slot) return false;

    this.slot = thing;

    return true;
  }

  render(ctx: Place, tick: number) {
    const glyph = this.slot?.render() || this.glyph.value;
    const style = ctx.findAgentsWithCell(this).filter((a) => a.isAlive).length
      ? esc(Colors.Bg.Blue) + esc(Colors.Fg.Black)
      : esc(Colors.Bg.Black) + esc(Colors.Fg.White);

    return style + glyph + esc(Style.Reset);
  }
}
