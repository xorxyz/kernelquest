import { UiBox } from './boxes';
import * as term from './term';

export const LINE_LENGTH = 60;
export const N_OF_LINES = 8;
export const CURSOR_OFFSET = 3;

export const navBox = new UiBox(80, 1, 1, 1, () => [
  term.style.invert +
  [
    ' xor4>',
    'King\'s Valley (0,0)',
    '1st 1/4 moon, 2038',
    '0 points',
  ].join('    ').padEnd(80, ' ') +
  term.style.reset,
]);

export const roomBox = new UiBox(32, 18, 3, 4, () => [
  '   x0 x1 x2 x3 x4 x5 x6 x7 x8 x9 xA xB xC xD xE xF',
  'x0 .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. ..',
  'x1 .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. ..',
  'x2 .. 🌵 .. .. .. .. .. .. .. .. .. .. .. .. .. ..',
  'x3 .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. ..',
  'x4 .. .. .. .. 🧙 .. .. .. .. .. .. .. .. .. .. ..',
  'x5 .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. ..',
  'x6 .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. ..',
  'x7 .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. ..',
  'x8 .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. ..',
]);

export const sideBox = new UiBox(10, 8, LINE_LENGTH + 2, 4, () => [
  '🧙',
  'name: John',
  'job: Wizard',
  '',
  '',
  'X: nothing',
  'Y: nothing',
  'A: nothing',
  'B: nothing',
]);

export const outputBox = new UiBox(LINE_LENGTH, N_OF_LINES, 3, 16, (state) => {
  const { logs } = state;

  return logs
    .slice(-N_OF_LINES)
    .map((line) => line.padEnd(LINE_LENGTH, ' '));
});

export const statsBox = new UiBox(10, N_OF_LINES, LINE_LENGTH + 2, 18, () => [
  'L: 1',
  'X: 0 ',
  'H: 100% ',
  'S: 100% ',
  'M: 100% ',
  '$: 0 ',
]);

export const promptBox = new UiBox(LINE_LENGTH, 2, 1, 24, (state) => {
  const { input } = state;
  const prompt = formatPrompt();

  return [
    (prompt + input).padEnd(LINE_LENGTH, ' '),
  ];
});

function formatPrompt() {
  return '$ ';
}
