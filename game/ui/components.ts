/**
 * - ui boxes: x,y numbering starts at 1.
 * - input fields - edit lines before before evaluating them as expressions
 */
import { esc, Cursor, Style, Colors } from 'xor4-lib/esc';
import { TakeN, takeN, Vector } from 'xor4-lib/math';
import { Cell } from '../engine/cell';
import { TTY } from './tty';

const { Fg, Bg } = Colors;

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

const title = 'xor4';

export class Navbar extends UiComponent {
  style = esc(Style.Invert);
  render({ player }) {
    return [(
      title.padEnd(SCREEN_WIDTH / 2 - 1, ' ') +
      String(player.tick).padStart(SCREEN_WIDTH / 2 - 1, ' ')
    ).padEnd(SCREEN_WIDTH - 1, ' ')];
  }
}

export class Axis extends UiComponent {
  style = esc(Style.Dim);
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
  render({ player, place }: TTY, tick: number) {
    return place.render(tick, player?.sees());
  }
}

const nothing = (n) => `${esc(Style.Dim)}${'nothing.'.padEnd(n, ' ')}${esc(Style.Reset)}`;

export class Sidebar extends UiComponent {
  render({ player }: TTY) {
    return [
      '┌───────────────────┐',
      `│ name: ${player.name.padEnd(11)} │`,
      `│ path: ${(`${player.type.appearance} ${player.type.name}`).padEnd(11)} │`,
      `│ hand: ${((player.hand?.label) || nothing(11)).padEnd(11)} │`,
      `│ eyes: ${((player.eyes?.label) || nothing(11)).padEnd(11)} │`,
      `│ feet: ${(((`[${player.body.position.label} ref]`).padEnd(11)))} │`,
      '│                   │',
      '│                   │',
      '│                   │',
      '│                   │',
      '│                   │',
      '│                   │',
      '└───────────────────┘',
    ];
  }
}

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

const Points = (bg, n) => {
  const str = `${String(n).padStart(3, ' ')} / 10 `;

  return (
    esc(Style.in(Fg.Black, bg, str.slice(0, n))) +
    esc(Style.in(Fg.White, Bg.Black, str.slice(n))) +
    esc(Style.Reset)
  );
};

const Hp = (n) => Points(Bg.Red, n);
const Sp = (n) => Points(Bg.Green, n);
const Mp = (n) => Points(Bg.Blue, n);

export class Stats extends UiComponent {
  render({ player: p }: TTY) {
    return [
      '┌───────────────────┐',
      '│ level: 1          │',
      '│ experience: 0     │',
      `│ gold: ${String(p.gp.value).padEnd(12, ' ')}│`,
      '│                   │',
      `│ health:  ${Hp(p.hp.value)}│`,
      `│ magic:   ${Mp(p.mp.value)}│`,
      `│ stamina: ${Sp(p.sp.value)}│`,
      '│                   │',
      `${'└'.padEnd(20, '─')}┘`,
    ];
  }
}

export class Output extends UiComponent {
  render({ state }: TTY) {
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
