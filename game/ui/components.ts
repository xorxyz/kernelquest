/**
 * - ui boxes: x,y numbering starts at 1.
 * - input fields - edit lines before before evaluating them as expressions
 */
import { esc, Cursor, Style, Colors } from '../lib/esc';
import { debug } from '../lib/logging';
import { TakeN, takeN, Vector } from '../lib/math';
import { Player } from '../engine/agents/agents';
import { Cell } from '../engine/world/cells';
import { IState, Terminal } from '../shell/terminal';

const { Fg, Bg } = Colors;

export const SCREEN_WIDTH = 60;
export const SCREEN_HEIGHT = 20;
export const LINE_LENGTH = 41;
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
      // .map((a) => { console.log(a); return a; })
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
      [what, place, time].join('            ').padEnd(SCREEN_WIDTH, ' '),
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
    return player.model.room.cells.map((r) => r.map((c) => c.render()).join(''));
  }
}

export class Scroll extends UiComponent {
  render({ player: p }: Terminal) {
    return p.spells.map((spell, i: number) =>
      `${i + 1}: ${spell.command}`.padEnd(10, ' '));
  }
}

const stringify = (x) => (x ? JSON.stringify(x.look?.bytes || x).replace(/"/g, '') : '');
const trim = (x) => (x.length > 12 ? `${x.slice(0, 12)}..` : x);
const nothing = `${esc(Style.Dim)}${'nothing.'.padEnd(11, ' ')}${esc(Style.Reset)}`;
const DF = (p: Player, n: number) =>
  (trim(stringify(p.stack[p.stack.length - 1 - n])) || nothing).padEnd(14, ' ');

export class Sidebar extends UiComponent {
  render({ player: p }) {
    return [
      '┌───────────────┐',
      '│ N: John       │',
      '│ P: 🧙Wizard   │',
      '│               │',
      `│ A: ${((p as Player).dragging?.name || nothing).padEnd(11, ' ')}│`,
      `│ B: ${nothing}│`,
      '│               │',
      `│ 0: ${DF(p, 0)}│`,
      `│ 1: ${DF(p, 1)}│`,
      `│ 2: ${DF(p, 2)}│`,
      `│ 3: ${DF(p, 3)}│`,
      `│ 4: ${DF(p, 4)}│`,
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
      `│ HP: ${Hp(p.health.value)}│`,
      `│ SP: ${Sp(p.stamina.value)}│`,
      `│ MP: ${Mp(p.mana.value)}│`,
      `│ GP: ${p.wealth.value}       │`,
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

export class Speech extends UiComponent {
  render({ player }: Terminal) {
    return Array.from(player.model.room.messages)
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
