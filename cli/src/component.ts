/**
 * - ui boxes: x,y numbering starts at 1.
 * - input fields - edit lines before before evaluating them as expressions
 */
import { esc, Cursor } from 'xor4-lib/esc';
import { Vector } from 'xor4-lib/math';
import { TTY } from './tty';

/** @category Component */
export const SCREEN_WIDTH = 72;
/** @category Component */
export const SCREEN_HEIGHT = 25;
/** @category Component */
export const LINE_LENGTH = 50;
/** @category Component */
export const N_OF_LINES = 7;
/** @category Component */
export const CELL_WIDTH = 2;

/** @category Component */
export abstract class UiComponent {
  public position: Vector;
  public style: string = '';

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  abstract render(terminal: TTY, tick: number): Array<string>

  compile(terminal: TTY, tick: number): string {
    const { x, y } = this.position;

    return esc(this.style) + this.render(terminal, tick)
      .map((line, i) => esc(Cursor.setXY(x, y + i)) + line)
      .join('');
  }
}
