/**
 * - ui boxes: x,y numbering starts at 1.
 * - input fields - edit lines before before evaluating them as expressions
 */
import { esc, Cursor, Style, Colors } from '../../lib/esc';
import { TakeN, takeN, Vector } from '../../lib/math';
import { Player } from '../engine/agents/agents';
import { Cell } from '../engine/world/cells';
import { testRoom } from '../engine/world/rooms';
import { IState, Terminal } from '../shell/terminal';

const { Fg, Bg } = Colors;

export const SCREEN_WIDTH = 60;
export const SCREEN_HEIGHT = 20;
export const LINE_LENGTH = 42;
export const N_OF_LINES = 5;
export const CELL_WIDTH = 2;

interface Props {
  player: Player,
  state: IState
}

export abstract class UiComponent {
  abstract render(p: Props): Array<string>

  position: Vector
  style: string = ''

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  compile(props: Props): string {
    const { x, y } = this.position;

    return this.style + this.render(props)
      .map((line, i) => esc(Cursor.setXY(x, y + i)) + line)
      .join('');
  }
}

export class Navbar extends UiComponent {
  style = esc(Style.Invert)
  render() {
    const what = ' xor4>';
    const time = '970-01-01';
    const place = 'King\'s Valley (0,0)';

    return [
      [what, place, time].join('            ').padEnd(SCREEN_WIDTH + 1, ' '),
    ];
  }
}

export class Axis extends UiComponent {
  style = esc(Style.Dim)
  render() {
    const x = '  0 1 2 3 4 5 6 7 8 9 A B C D E F';
    const y = x.trim().split(' ');

    return [
      x,
      ...y.slice(0, 10),
    ];
  }
}

export const takeCellPair: TakeN<Cell> = takeN(2);

export class RoomMap extends UiComponent {
  render() {
    return testRoom.cells.map((row) =>
      row.map((cell) => cell.bg).join(''));
  }
}

export class Scroll extends UiComponent {
  render({ player: p }: Terminal) {
    return p.spells.map((spell, i: number) =>
      `${i + 1}: ${spell.command}`.padEnd(10, ' '));
  }
}

const nothing = `${esc(Style.Dim)}nothing`;

export class Sidebar extends UiComponent {
  render({ player: p }) {
    return [
      '┌───────────────┐',
      '│ N: John       │',
      '│ P: 🧙Wizard   │',
      '│               │',
      `│ 4: ${(p.stack.peekN(4)?.value.toString() || nothing).padEnd(15, ' ')}│`,
      `│ 3: ${(p.stack.peekN(3)?.value.toString() || nothing).padEnd(15, ' ')}│`,
      `│ 2: ${(p.stack.peekN(2)?.value.toString() || nothing).padEnd(15, ' ')}│`,
      `│ 1: ${(p.stack.peekN(1)?.value.toString() || nothing).padEnd(15, ' ')}│`,
      `│ 0: ${(p.stack.peekN(0)?.value.toString() || nothing).padEnd(15, ' ')}│`,
      '│               │',
      '│               │',
      '└───────────────┘',
    ];
  }
}

export class Box extends UiComponent {
  width: number
  private lines: Array<string> = []

  constructor(w, x, y) {
    super(x, y);

    this.width = w;
  }

  addLines(lines: Array<string>) {
    this.lines = [...this.lines, ...lines.map((l) => l.slice(0, this.width))];
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

const Hp = (str) => esc(Style.in(Fg.Black, Bg.Red, str)) + esc(Style.Reset);
const Sp = (str) => esc(Style.in(Fg.Black, Bg.Green, str)) + esc(Style.Reset);
const Mp = (str) => esc(Style.in(Fg.Black, Bg.Blue, str)) + esc(Style.Reset);

export class Stats extends UiComponent {
  render({ player: p }: Terminal) {
    return [
      '┌───────────────┐',
      '│ LV: 1         │',
      '│ XP: 0 of 100  │',
      `│ HP: ${Hp('5 of 5')}    │`,
      `│ SP: ${Sp('5 of 5')}    │`,
      `│ MP: ${Mp('5 of 5')}    │`,
      `│ GP: ${p.wealth.value}         │`,
      `${'└'.padEnd(16, '─')}┘`,
    ];
  }
}

export class Output extends UiComponent {
  render({ state }: Terminal) {
    return [
      '┌────────────────────────────────────────┐'].concat(
      state.stdout
        .slice(-N_OF_LINES)
        .map((line) => `│ ${(String(line || '')).padEnd(LINE_LENGTH - 4, ' ')} │`),
    );
  }
}

export class Input extends UiComponent {
  render({ state }) {
    const { line, prompt } = state;

    return [
      `│ ${(prompt + line).padEnd(LINE_LENGTH - 4, ' ')} │`,
      '└────────────────────────────────────────┘',
    ];
  }
}
