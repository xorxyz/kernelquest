import { EventEmitter } from 'events';

const ctrl = (str) => `\u001B${str}`;

export default class LineDiscipline extends EventEmitter {
  line: string = ''
  history: Array<string>
  cursor: { x: number, y: number } = { x: 0, y: 0 }

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

  clearLine() {
    const clearLine = ctrl('[2K');
    const lineStart = ctrl('[G');

    this.emit('line', clearLine + lineStart);
  }

  submit() {
    this.emit('line', this.line);
    this.resetBuffer();
    this.clearLine();
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

  sigInt() {
    this.emit('SIGINT');
  }

  handleBuffer(buf?: Buffer): void {
    if (!buf) return;

    switch (buf.toString('hex')) {
      case '03':
        this.sigInt();
        break;
      case '09':
        this.tab();
        break;
      case '7f':
        this.backspace();
        break;
      case '1b5b41':
        this.prev();
        break;
      case '1b5b42':
        this.next();
        break;
      case '1b5b44':
        this.left();
        break;
      case '1b5b43':
        this.right();
        break;
      case '0d':
        this.submit();
        break;
      default:
        this.char(buf.toString());
        break;
    }
  }
}
