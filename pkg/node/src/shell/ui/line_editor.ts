/*
 * edit lines before before evaluating them as expressions
 */

import { EventEmitter } from 'events';

const ARROW_UP = '1b5b41';
const ARROW_DOWN = '1b5b42';
const ARROW_LEFT = '1b5b44';
const ARROW_RIGHT = '1b5b43';
const ENTER = '0d';
const BACKSPACE = '7f';

export default class LineEditor extends EventEmitter {
  line: string = ''
  history: Array<string>
  cursor: { x: number, y: number } = { x: 0, y: 0 }

  handleInput(buf: Buffer): void {
    const chars = this.line.split('');
    const key = buf.toString();
    const { x } = this.cursor;

    switch (buf.toString('hex')) {
      case '03':
        this.emit('SIGINT');
        break;
      case '09':
        break;
      case BACKSPACE:
        if (!this.line.length) return;
        this.cursor.x--;
        this.line = [...chars.slice(0, x - 1), ...chars.slice(x)].join('');
        this.line = this.line.slice(0, this.line.length);
        break;
      case ARROW_UP:
        break;
      case ARROW_DOWN:
        break;
      case ARROW_LEFT:
        if (this.cursor.x === 0) return;
        this.cursor.x--;
        break;
      case ARROW_RIGHT:
        if (this.cursor.x === this.line.length) return;
        this.cursor.x++;
        break;
      case ENTER:
        this.line = '';
        this.cursor.x = 0;
        break;
      default:
        this.line = [...chars.slice(0, x), key, ...chars.slice(x)].join('');
        this.cursor.x++;
        break;
    }

    this.emit('update', {
      line: this.line,
      cursor: this.cursor,
    });
  }
}
