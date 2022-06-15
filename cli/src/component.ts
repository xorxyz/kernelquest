/**
 * - ui boxes: x,y numbering starts at 1.
 * - input fields - edit lines before before evaluating them as expressions
 */
import { esc, Cursor } from 'xor4-lib/esc';
import { Vector } from 'xor4-lib/math';
import { VirtualTerminal } from './pty';

/** @category Component */
export const SCREEN_WIDTH = 80;
/** @category Component */
export const SCREEN_HEIGHT = 25;
/** @category Component */
export const N_OF_LINES = 7;
/** @category Component */
export const CELL_WIDTH = 2;

/** @category Component */
export abstract class UiComponent {
  public position: Vector;
  public style: string = '';
  public z: number = 0;

  constructor(x: number, y: number, z?: number) {
    this.position = new Vector(x, y);
    if (z) this.z = z;
  }

  abstract render(pty: VirtualTerminal, tick: number): Array<string>

  compile(pty: VirtualTerminal, tick: number): string {
    const { x, y } = this.position;

    return esc(this.style) + this.render(pty, tick)
      .map((line, i) => esc(Cursor.setXY(x, y + i)) + line)
      .join('');
  }
}
