/**
 * - ui boxes: x,y numbering starts at 1.
 * - input fields - edit lines before before evaluating them as expressions
 */
import * as esc from '../../lib/esc';
import { Vector } from '../../lib/math';
import { testRoom } from '../engine/world/rooms';
import { Terminal } from '../server/terminal';

export const SCREEN_WIDTH = 60;
export const LINE_LENGTH = 42;
export const N_OF_LINES = 5;
export const CELL_WIDTH = 2;

export abstract class UiComponent {
  position: Vector

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  abstract print(term: Terminal):Array<string>

  render(term: Terminal): string {
    return this
      .print(term)
      .map((line, y) => (
        esc.cursor.setXY(this.position.x, this.position.y + y) + line
      ))
      .join('');
  }
}

export class Navbar extends UiComponent {
  print() {
    const what = ' xor4>';
    const time = '2038-01-01';
    const place = 'King\'s Valley (0,0)';

    return [
      esc.style.invert +
      [what, place, time].join('            ').padEnd(SCREEN_WIDTH, ' ') +
      esc.style.reset,
    ];
  }
}

export class Axis extends UiComponent {
  print() {
    const x = '  0 1 2 3 4 5 6 7 8 9';
    const y = x.trim().split(' ');

    return [x, ...y].map((str) => esc.style.dim(str));
  }
}

export class RoomMap extends UiComponent {
  print() {
    return testRoom.cells.map((row, y) => row.map((cell, x) => {
      const { bg } = cell;
      return bg;
    }).join(''));
  }
}

export class Scroll extends UiComponent {
  print({ me }: Terminal) {
    return me.spells.map((spell, i: number) =>
      `${i + 1}: ${spell.command}`.padEnd(10, ' '));
  }
}

const nothing = esc.style.dim('nothing');

export class Sidebar extends UiComponent {
  print({ me }) {
    return [
      'N: John',
      'P: 🧙Wizard',
      '',
      `4: ${(me.stack.peekN(4)?.value.toString() || nothing).padEnd(10, ' ')}`,
      `3: ${(me.stack.peekN(3)?.value.toString() || nothing).padEnd(10, ' ')}`,
      `2: ${(me.stack.peekN(2)?.value.toString() || nothing).padEnd(10, ' ')}`,
      `1: ${(me.stack.peekN(1)?.value.toString() || nothing).padEnd(10, ' ')}`,
      `0: ${(me.stack.peekN(0)?.value.toString() || nothing).padEnd(10, ' ')}`,
    ];
  }
}

export class Stats extends UiComponent {
  print({ me }: Terminal) {
    return [
      'LV: 1',
      'XP: 0 of 100 ',
      `HP: ${esc.style.fg.black(esc.style.bg.red('5 of 5'))}`,
      `SP: ${esc.style.fg.black(esc.style.bg.green('5 of 5'))}`,
      `MP: ${esc.style.fg.black(esc.style.bg.blue('5 of 5'))}`,
      `GP: ${me.wealth.value}`,
    ];
  }
}

export class Output extends UiComponent {
  print({ state }: Terminal) {
    return state.stdout
      .slice(-N_OF_LINES)
      .map((line) => (String(line || '')).padEnd(LINE_LENGTH, ' '));
  }
}

export class Input extends UiComponent {
  print({ state }) {
    const { line, prompt } = state;

    return [
      (prompt + line).padEnd(LINE_LENGTH, ' '),
    ];
  }
}

function chunkString(str, length) {
  return str.match(new RegExp(`.{1,${length}}`, 'g'));
}
