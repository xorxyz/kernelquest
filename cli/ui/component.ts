/**
 * - ui boxes: x,y numbering starts at 1.
 * - input fields - edit lines before before evaluating them as expressions
 */
import { esc, Cursor, Style } from 'xor4-lib/esc';
import { Vector } from 'xor4-lib/math';
import { TTY } from './tty';

export const SCREEN_WIDTH = 72;
export const SCREEN_HEIGHT = 25;
export const LINE_LENGTH = 50;
export const N_OF_LINES = 7;
export const CELL_WIDTH = 2;

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

// export const takeCellPair: TakeN<Cell> = takeN(2);

export class Box extends UiComponent {
  width: number;
  private lines: Array<string> = [];

  constructor(w, x, y, lines: Array<string>) {
    super(x, y);

    this.width = w;
    this.lines = lines.map((l) => l.slice(0, this.width));
  }

  render() {
    return [
      `${'┌'.padEnd(this.width, '─')}┐`,
      ...this.lines.map((line) =>
        `│ ${line} │`),
      `${'└'.padEnd(this.width, '─')}┘`,
    ];
  }
}

const dummyRoom: Array<Array<any>> = [];

export class Speech extends UiComponent {
  render() {
    return dummyRoom
      .map(([agent, message]) => [
        esc(Style.Invert),
        esc(Cursor.set(
          this.position.clone()
            .addX(agent.position.x * 2)
            .subX(Math.floor(message.text.length / 2))
            .addY(agent.position.y - 1),
        )),
        message.text,
      ].join(''));
  }
}
