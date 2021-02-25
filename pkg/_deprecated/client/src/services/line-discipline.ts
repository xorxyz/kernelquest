// line discipline
// line-editing and history capabilities
// responsible for local echo, line editing, processing of input modes, processing of output modes, and character mapping
//   move the text cursor
//   search the command history
//   control a kill ring
//   use tab completion

import { EventEmitter } from 'events';

const ctrl = (str) => `\u001B${str}`;

export default class LineDiscipline extends EventEmitter {
  line: string = ''
  history: Array<string>
  cursor: { x: number, y: number } = { x: 0, y: 0 }
  mode: 'raw'|'cooked' = 'cooked'

  read() {
    return this.line;
  }

  resetBuffer() {
    this.line = '';
    this.cursor.x = 0;
  }

  left() {
    if (this.cursor.x === 0) {
      return;
    }

    this.cursor.x--;
    this.emit('write', ctrl('[1D'));
  }

  right() {
    if (this.cursor.x === this.line.length) {
      return;
    }

    this.cursor.x++;
    this.emit('write', ctrl('[1C'));
  }

  submit() {
    const clearLine = ctrl('[2K');
    const lineStart = ctrl('[G');

    this.emit('write', clearLine + lineStart);
    this.emit('line', this.line);
    this.resetBuffer();
  }

  backspace() {
    if (!this.line.length) return;

    const chars = this.line.split('');
    const { x } = this.cursor;

    this.cursor.x--;
    this.line = [...chars.slice(0, x - 1), ...chars.slice(x)].join('');
    this.line = this.line.slice(0, this.line.length);

    const moveLeft = ctrl('[1D');
    const eraseRight = ctrl('[K');
    const rest = [...chars.slice(x)].join('');

    let str = moveLeft + eraseRight + rest;

    if (rest) {
      const moveBackLeft = ctrl(`[${rest.length}D`);
      str += moveBackLeft;
    }

    this.emit('write', str);
  }

  char(key): void {
    const chars = this.line.split('');
    const { x } = this.cursor;
    const str = x >= this.line.length
      ? key
      : ctrl(`[1@${key}`);

    this.line = [...chars.slice(0, x), key, ...chars.slice(x)].join('');
    this.cursor.x++;

    this.emit('write', str);
  }

  prev() {
    this.cursor.y--;
  }

  next() {
    this.cursor.y++;
  }

  // eslint-disable-next-line class-methods-use-this
  tab() {}

  handleKey({ key, domEvent }): void {
    if (this.mode === 'raw') {
      this.char(key);

      return;
    }

    switch (domEvent.key) {
      case 'Tab':
        this.tab();
        break;
      case 'Backspace':
        this.backspace();
        break;
      case 'ArrowUp':
        this.prev();
        break;
      case 'ArrowDown':
        this.next();
        break;
      case 'ArrowLeft':
        this.left();
        break;
      case 'ArrowRight':
        this.right();
        break;
      case 'Enter':
        this.submit();
        break;
      default:
        this.char(key);
        break;
    }
  }
}
