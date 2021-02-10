/*
 * edit lines before before evaluating them as expressions
 */
import { EventEmitter } from 'events';
import { debug } from '../../../lib/logging';

const ARROW_UP = '1b5b41';
const ARROW_DOWN = '1b5b42';
const ARROW_LEFT = '1b5b44';
const ARROW_RIGHT = '1b5b43';
const ENTER = '0d';
const BACKSPACE = '7f';
const TAB = '09';
const SIGINT = '03';

export default class LineEditor extends EventEmitter {
  line: string = ''
  history: Array<string>
  cursor: { x: number, y: number } = { x: 0, y: 0 }

  handleInput(buf: Buffer): void {
    const chars = this.line.split('');
    const key = buf.toString();
    const hex = buf.toString('hex');
    const { x } = this.cursor;

    debug(`got char: ${key}`);

    switch (hex) {
      case SIGINT:
        this.emit('SIGINT');
        break;
      case TAB:
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
