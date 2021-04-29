/**
 * - ui boxes: x,y numbering starts at 1.
 * - input fields - edit lines before before evaluating them as expressions
 */
import { esc, Cursor, Style, Colors } from '../../lib/esc';
import { TakeN, takeN, Vector } from '../../lib/math';
import { Hero } from '../engine/agents';
import { Cell } from '../engine/world';
import { IState, Terminal } from './terminal';

const { Fg, Bg } = Colors;

export const SCREEN_WIDTH = 60;
export const SCREEN_HEIGHT = 20;
export const LINE_LENGTH = 41;
export const N_OF_LINES = 5;
export const CELL_WIDTH = 2;

interface Props {
  player: Hero,
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
  render({ player }) {
    const what = ' kernel.quest';
    const time = player.tick;

    return [
      [what, time].join('  ').padEnd(SCREEN_WIDTH, ' '),
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
  render({ player }) {
    return player.view.rows.map((row, y) =>
      row.map((cell, x) => (
        player.position.x === x && player.position.y === y
          ? player.render()
          : cell.render()
      )).join(''));
  }
}

const nothing = `${esc(Style.Dim)}${'nothing.'.padEnd(10, ' ')}${esc(Style.Reset)}`;

export class Sidebar extends UiComponent {
  render() {
    return [
      '┌───────────────┐',
      '│ N: John       │',
      '│ P: 🧙Wizard   │',
      '│               │',
      `│ A: ${nothing} │`,
      `│ B: ${nothing} │`,
      '│               │',
      '│               │',
      '│               │',
      '│               │',
      '│               │',
      '│               │',
      '└───────────────┘',
    ];
  }
}

export class Box extends UiComponent {
  width: number
  private lines: Array<string> = []

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

const Points = (bg, n) => {
  const i = Math.ceil(n / 10);

  const str = `${n} of 100`.padStart(10, ' ');
  return (
    esc(Style.in(Fg.Black, bg, str.slice(0, i))) +
    esc(Style.in(Fg.White, Bg.Black, str.slice(i))) +
    esc(Style.Reset)
  );
};

const Hp = (n) => Points(Bg.Red, n);
const Sp = (n) => Points(Bg.Green, n);
const Mp = (n) => Points(Bg.Blue, n);

export class Stats extends UiComponent {
  render({ player: p }: Terminal) {
    return [
      '┌───────────────┐',
      '│ LV: 01        │',
      '│ XP: 0         │',
      `│ HP: ${Hp(p.hp.value)}│`,
      `│ SP: ${Sp(p.sp.value)}│`,
      `│ MP: ${Mp(p.mp.value)}│`,
      `│ GP: ${p.gp.value}       │`,
      `${'└'.padEnd(16, '─')}┘`,
    ];
  }
}

export class Output extends UiComponent {
  render({ stdout }: Terminal) {
    return [
      `┌${'─'.padEnd(LINE_LENGTH - 2, '─')}┐`,
      ...stdout
        .slice(-N_OF_LINES)
        .map((line) =>
          `│ ${(line || '').padEnd(LINE_LENGTH - 4, ' ')} │`),
    ];
  }
}

export class Input extends UiComponent {
  render({ state }) {
    const { line, prompt } = state;

    return [
      `│ ${(prompt + line).padEnd(LINE_LENGTH - 4, ' ')} │`,
      `└${'─'.padEnd(LINE_LENGTH - 2, '─')}┘`,
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
