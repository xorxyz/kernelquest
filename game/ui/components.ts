/**
 * - ui boxes: x,y numbering starts at 1.
 * - input fields - edit lines before before evaluating them as expressions
 */
import { esc, Cursor, Style, Colors } from '../../lib/esc';
import { TakeN, takeN, Vector } from '../../lib/math';
import { Agent } from '../engine/agents';
import { Cell } from '../engine/world';
import { Terminal } from './terminal';

const { Fg, Bg } = Colors;

export const SCREEN_WIDTH = 60;
export const SCREEN_HEIGHT = 20;
export const LINE_LENGTH = 41;
export const N_OF_LINES = 5;
export const CELL_WIDTH = 2;

export abstract class UiComponent {
  abstract render(terminal: Terminal): Array<string>

  position: Vector
  style: string = ''

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  compile(terminal: Terminal): string {
    const { x, y } = this.position;

    return this.style + this.render(terminal)
      .map((line, i) => esc(Cursor.setXY(x, y + i)) + line)
      .join('');
  }
}

const title = 'kernel.quest';

export class Navbar extends UiComponent {
  style = esc(Style.Invert)
  render({ player }) {
    return [
      [title, player.cycle].join('  ').padEnd(SCREEN_WIDTH, ' '),
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
    return (player as Agent).room.render();
  }
}

const nothing = `${esc(Style.Dim)}${'nothing.'.padEnd(10, ' ')}${esc(Style.Reset)}`;

export class Sidebar extends UiComponent {
  render({ player }) {
    return [
      '┌───────────────┐',
      `│ n: ${player.name.padEnd(10)} │`,
      `│ p: ${player.type.appearance.padEnd(10)} │`,
      '│               │',
      `│ a: ${nothing} │`,
      `│ b: ${nothing} │`,
      `│ c: ${nothing} │`,
      `│ d: ${nothing} │`,
      `│ e: ${nothing} │`,
      `│ f: ${nothing} │`,
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
  const str = `${String(n).padStart(3, ' ')} / 100 `;
  const i = Math.ceil(n / 10);

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
      '│ lv: 01        │',
      '│ xp: 0         │',
      `│ hp: ${Hp(p.hp.value)}│`,
      `│ sp: ${Sp(p.sp.value)}│`,
      `│ mp: ${Mp(p.mp.value)}│`,
      `│ gp: ${p.gp.value}       │`,
      `${'└'.padEnd(16, '─')}┘`,
    ];
  }
}

export class Output extends UiComponent {
  render({ state }: Terminal) {
    return [
      `┌${'─'.padEnd(LINE_LENGTH - 2, '─')}┐`,
      ...state.stdout
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
  render({ player }) {
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
