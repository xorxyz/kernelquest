import { UiBox } from './lib';
import * as esc from '../../lib/esc';

export const LINE_LENGTH = 60;
export const N_OF_LINES = 8;
export const CURSOR_OFFSET = 3;
export const CELL_WIDTH = 3;

export class NavBox extends UiBox {
  print() {
    return [
      esc.style.invert +
      [
        ' xor4>',
        'King\'s Valley (0,0)',
        '1st 1/4 moon, 2038',
        '0 points',
      ].join('    ').padEnd(80, ' ') +
      esc.style.reset,
    ];
  }
}

export class RoomBox extends UiBox {
  print({ cursor }) {
    return [
      '   x0 x1 x2 x3 x4 x5 x6 x7 x8 x9',
      'x0 .. .. .. .. .. .. .. .. .. ..',
      'x1 .. .. .. .. .. .. .. .. .. ..',
      'x2 .. 🌵 .. .. .. .. .. .. .. ..',
      'x3 .. .. .. .. .. .. .. .. .. ..',
      'x4 .. .. .. .. .. .. .. .. .. ..',
      'x5 .. .. .. .. .. .. .. .. .. ..',
      'x6 .. .. .. .. .. .. .. .. .. ..',
      'x7 .. .. .. .. .. .. .. .. .. ..',
      'x8 .. .. .. .. .. .. .. .. .. ..',
      'x9 .. .. .. .. .. .. .. .. .. ..',
    ].map((line, y) => ((y !== cursor.y)
      ? line
      : [
        ...line.slice(0, cursor.x),
        '🧙',
        ...line.slice(cursor.x + 2),
      ].join('')));
  }
}

export class SideBox extends UiBox {
  print() {
    return [
      '🧙',
      'name: John',
      'job: Wizard',
      '',
      'X: nothing',
      'Y: nothing',
      'A: nothing',
      'B: nothing',
    ];
  }
}

export class OutputBox extends UiBox {
  print(state) {
    const { stdout } = state;

    return stdout
      .slice(-N_OF_LINES)
      .map((line) => line.padEnd(LINE_LENGTH, ' '));
  }
}

export class StatsBox extends UiBox {
  print() {
    return [
      'L: 1',
      'X: 0 ',
      '',
      'H: 100% ',
      'S: 100% ',
      'M: 100% ',
      '',
      '$: 0 ',
    ];
  }
}

export class PromptBox extends UiBox {
  print(state) {
    const { line, prompt } = state;

    return [(prompt + line).padEnd(LINE_LENGTH, ' ')];
  }
}
