import { Colors, esc, Style } from 'xor4-lib/esc';
import { Vector } from 'xor4-lib/math';
import { Agent } from './agents';
import { Room } from './room';
import { Thing } from './things';
import { EMPTY_CELL_CHARS } from '../constants';

export class Glyph {
  private chars: string;

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

  private glyph: Glyph = new Glyph();
  private slot: Agent | Thing | null = null;

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  public get name() {
    return String(this.position.x) + String(this.position.y);
  }

  public get isBlocked() {
    return this.slot !== null;
  }

  update() {
  }

  clear() {
    this.slot = null;
    this.glyph = new Glyph();
  }

  leave(): Agent | null {
    if (!this.slot || this.slot instanceof Thing) return null;
    const agent = this.slot;

    this.slot = null;

    return agent;
  }

  enter(agent: Agent): boolean {
    if (this.isBlocked) return false;

    this.slot = agent;

    return true;
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

  read() {
    return this.glyph.value;
  }

  look() {
    return this.slot;
  }

  write(chars: string) {
    this.glyph = new Glyph(chars);
  }

  has(thing: Agent | Thing) {
    return this.slot === thing;
  }

  render(ctx: Room) {
    const glyph = this.slot?.render() || this.read();
    const style = ctx.cellIsHeld(this)
      ? esc(Colors.Bg.Blue) + esc(Colors.Fg.Black)
      : esc(Colors.Bg.Black) + esc(Colors.Fg.White);

    return style + glyph + esc(Style.Reset);
  }
}
