/**
 * - ui boxes: x,y numbering starts at 1.
 * - input fields - edit lines before before evaluating them as expressions
 */
import { esc, Cursor, Style, Colors } from '../../lib/esc';
import { Vector } from '../../lib/math';
import { Player } from '../engine/agents/agents';
import { testRoom } from '../engine/world/rooms';
import { IState, Terminal } from '../server/terminal';

const { Fg, Bg } = Colors;

export const SCREEN_WIDTH = 60;
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
    const { x } = this.position;

    return this.style + this.render(props)
      .map((line, y) => esc(Cursor.setXY(x, y + y)) + line)
      .join('');
  }
}

export class Navbar extends UiComponent {
  style = esc(Style.Invert)
  render() {
    const what = ' xor4>';
    const time = '2038-01-01';
    const place = 'King\'s Valley (0,0)';

    return [
      [what, place, time].join('            ').padEnd(SCREEN_WIDTH, ' '),
    ];
  }
}

export class Axis extends UiComponent {
  style = esc(Style.Dim)
  render() {
    const x = '  0 1 2 3 4 5 6 7 8 9';
    const y = x.trim().split(' ');

    return [
      x,
      ...y,
    ];
  }
}

export class RoomMap extends UiComponent {
  render() {
    return testRoom.cells
      .map((row) => row.map((cell) => cell.bg).join(''));
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
      'N: John',
      'P: 🧙Wizard',
      // '',
      // `4: ${(p.stack.peekN(4)?.value.toString() || nothing).padEnd(10, ' ')}`,
      // `3: ${(p.stack.peekN(3)?.value.toString() || nothing).padEnd(10, ' ')}`,
      // `2: ${(p.stack.peekN(2)?.value.toString() || nothing).padEnd(10, ' ')}`,
      // `1: ${(p.stack.peekN(1)?.value.toString() || nothing).padEnd(10, ' ')}`,
      // `0: ${(p.stack.peekN(0)?.value.toString() || nothing).padEnd(10, ' ')}`,
    ];
  }
}

const HpBar = (str) => Style.in(Fg.Black, Bg.Red, str);
const SpBar = (str) => Style.in(Fg.Black, Bg.Green, str);
const MpBar = (str) => Style.in(Fg.Black, Bg.Blue, str);

export class Stats extends UiComponent {
  render({ player: p }: Terminal) {
    return [
      'LV: 1',
      'XP: 0 of 100 ',
      `HP: ${HpBar('5 of 5')}`,
      `SP: ${SpBar('5 of 5')}`,
      `MP: ${MpBar('5 of 5')}`,
      `GP: ${p.wealth.value}`,
    ];
  }
}

export class Output extends UiComponent {
  render({ state }: Terminal) {
    return state.stdout
      .slice(-N_OF_LINES)
      .map((line) => (String(line || '')).padEnd(LINE_LENGTH, ' '));
  }
}

export class Input extends UiComponent {
  render({ state }) {
    const { line, prompt } = state;

    return [
      (prompt + line).padEnd(LINE_LENGTH, ' '),
    ];
  }
}
