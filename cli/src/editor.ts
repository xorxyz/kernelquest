import { Vector, Keys } from 'xor4-lib';
import { LINE_LENGTH } from './component';

declare const Buffer;

/** @category Editor */
export class Editor {
  line: string = '';
  readonly cursor: Vector = new Vector();

  get value() {
    return this.line;
  }

  /* returns true if input box needs an update */
  insert(str: string): boolean {
    if (str === Keys.BACKSPACE) return this.backspace();
    if (str === Keys.ARROW_LEFT) return this.moveLeft();
    if (str === Keys.ARROW_RIGHT) return this.moveRight();

    /* catch all other ctrl sequences */
    if (str.startsWith('1b')) return false;

    if (this.line.length === LINE_LENGTH - 6) return false;

    const bytes = Buffer.from(str, 'hex');
    const chars = this.line.split('');
    const { x } = this.cursor;

    this.line = [...chars.slice(0, x), bytes, ...chars.slice(x)].join('');
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

  reset(): boolean {
    this.line = '';
    this.cursor.x = 0;
    return true;
  }
}
