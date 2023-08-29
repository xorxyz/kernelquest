import { Buffer } from 'buffer';
import { Vector, Keys, LINE_LENGTH } from '../shared';

// declare const Buffer;

/** @category Editor */
export class Editor {
  private line = '';
  readonly cursor: Vector = new Vector();
  private history = [] as Array<string>;

  get value() {
    return this.line;
  }

  /* returns true if input box needs an update */
  insert(str: string): boolean {
    if (str === Keys.BACKSPACE) return this.backspace();
    if (str === Keys.ARROW_LEFT) return this.moveLeft();
    if (str === Keys.ARROW_RIGHT) return this.moveRight();
    if (str === Keys.ARROW_UP) return this.moveUp();
    if (str === Keys.ARROW_DOWN) return this.moveDown();

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

  moveUp(): boolean {
    if (this.cursor.y === 0) return false;

    if (this.cursor.y >= this.history.length) {
      this.history.push(this.line);
    }

    if (this.cursor.y === this.history.length - 1) {
      this.history[this.cursor.y] = this.line;
    }

    this.cursor.y--;
    this.line = this.history[this.cursor.y];
    this.cursor.x = this.line.length;

    return true;
  }

  moveDown(): boolean {
    if (this.cursor.y >= this.history.length - 1) return false;

    this.cursor.y++;
    this.line = this.history[this.cursor.y];
    this.cursor.x = this.line.length;

    return true;
  }

  reset(): boolean {
    this.history.push(this.line);
    this.history = this.history.filter((x) => x); // remove blank lines
    this.line = '';
    this.cursor.x = 0;
    this.cursor.y = this.history.length;
    return true;
  }
}
