/**
 * - ui boxes: x,y numbering starts at 1.
 * - input fields - edit lines before before evaluating them as expressions
 */
import { esc, Cursor, Style, Colors } from '../../lib/esc';
import { TakeN, takeN, Vector } from '../../lib/math';
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

const nothing = `${esc(Style.Dim)}${'nothing    '}${esc(Style.Reset)}`;
const DF = (p: Player, n: number) =>
  (p.stack.peekN(n)?.name || nothing).padEnd(10, ' ');

export class Sidebar extends UiComponent {
  render({ player: p }) {
    return [
      '┌───────────────┐',
      '│ N: John       │',
      '│ P: 🧙Wizard   │',
      '│               │',
      `│ 4: ${DF(p, 4)}│`,
      `│ 3: ${DF(p, 3)}│`,
      `│ 2: ${DF(p, 2)}│`,
      `│ 1: ${DF(p, 1)}│`,
      `│ 0: ${DF(p, 0)}│`,
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

const Points = (bg, str) =>
  esc(Style.in(Fg.Black, bg, str.padEnd(10, ' '))) + esc(Style.Reset);
const Hp = (str) => Points(Bg.Red, str);
const Sp = (str) => Points(Bg.Green, str);
const Mp = (str) => Points(Bg.Blue, str);

export class Stats extends UiComponent {
  render({ player: p }: Terminal) {
    return [
      '┌───────────────┐',
      '│ LV:   1 of 100│',
      '│ XP:   0 of 100│',
      `│ HP: ${Hp('  1 of 100')}│`,
      `│ SP: ${Sp(' 10 of 100')}│`,
      `│ MP: ${Mp('100 of 100')}│`,
      `│ GP: ${p.wealth.value}         │`,
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
