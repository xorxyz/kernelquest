/**
 * - ui boxes: x,y numbering starts at 1.
 * - input fields - edit lines before before evaluating them as expressions
 */
import { Vector } from '../../lib/math';
import * as term from '../../lib/esc';
import { IShellState } from '../shell/shell';

export const ARROW_UP = '1b5b41';
export const ARROW_DOWN = '1b5b42';
export const ARROW_LEFT = '1b5b44';
export const ARROW_RIGHT = '1b5b43';
export const ENTER = '0d';
export const BACKSPACE = '7f';
export const TAB = '09';
export const SIGINT = '03';

export abstract class UiBox {
  position: Vector

  abstract print(state: IShellState):Array<string>

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  render(state: IShellState): string {
    const offset = (
      term.cursor.down(1) +
      term.line.start +
      term.cursor.right(this.position.x - 1) +
      term.line.clearAfter
    );

    const lines = this.print(state).map((line) => line + offset);

    return (
      term.cursor.setXY(this.position.x, this.position.y) +
      lines.join('')
    );
  }
}

export class InputField {
  private line: string = ''
  private cursor: Vector = new Vector()

  get value() {
    return this.line;
  }

  get x() {
    return this.cursor.x;
  }

  get y() {
    return this.cursor.y;
  }

  /* returns true if input box needs an update */
  insert(buf: Buffer): boolean {
    const char = buf.toString();
    const hexCode = buf.toString('hex');

    if (hexCode === BACKSPACE) return this.backspace();
    if (hexCode === ARROW_LEFT) return this.moveLeft();
    if (hexCode === ARROW_RIGHT) return this.moveRight();
    if (hexCode === ENTER) return this.submit();

    /* catch all other ctrl sequences */
    if (hexCode.startsWith('1b')) return false;

    const chars = this.line.split('');
    const { x } = this.cursor;

    this.line = [...chars.slice(0, x), char, ...chars.slice(x)].join('');
    this.cursor.x++;

    return true;
  }

  backspace(): boolean {
    if (!this.line.length) return false;

    const chars = this.line.split('');
    const { x } = this.cursor;

    this.cursor.x--;
    this.line = [...chars.slice(0, x - 1), ...chars.slice(x)].join('');
    this.line = this.line.slice(0, this.line.length);

    return true;
  }

  moveLeft(): boolean {
    if (this.cursor.x === 0) return false;
    this.cursor.x--;
    return true;
  }

  moveRight(): boolean {
    if (this.cursor.x === this.line.length) return false;
    this.cursor.x++;
    return true;
  }

  submit(): boolean {
    this.line = '';
    this.cursor.x = 0;
    return true;
  }
}
