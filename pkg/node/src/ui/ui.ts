import { UiBox } from './boxes';
import * as term from './term';

export const LINE_LENGTH = 60;
export const N_OF_LINES = 10;
export const prompt = '$ ';
export const CURSOR_OFFSET = 3;

export const navBox = new UiBox(80, 1, 1, 1, () => [
  term.style.invert +
  [
    ' xor4>',
    'John @ King\'s Valley',
    '1st 1/4 moon, 2038',
    '0 points',
  ].join('    ').padEnd(80, ' ') +
  term.style.reset,
]);

export const roomBox = new UiBox(16, 9, 18, 4, () => [
  '   x0 x1 x2 x3 x4 x5 x6 x7',
  'x0 .. .. .. .. .. .. .. ..',
  'x1 .. .. .. .. .. .. .. ..',
  'x2 .. 🌵 .. .. .. .. .. ..',
  'x3 .. .. .. .. .. .. .. ..',
  'x4 .. .. .. .. 🧙 .. .. ..',
  'x5 .. .. .. .. .. .. .. ..',
  'x6 .. .. .. .. .. .. .. ..',
  'x7 .. .. .. .. .. .. .. ..',
]);

export const sideBox = new UiBox(10, 8, 56, 4, () => [
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

export const outputBox = new UiBox(LINE_LENGTH, N_OF_LINES, 2, 16, (state) => {
  const { logs } = state;

  return logs
    .slice(-8)
    .map((line) => line.padEnd(LINE_LENGTH, ' '));
});

export const statsBox = new UiBox(10, N_OF_LINES, 56, 18, () => [
  'L: 1',
  'X: 0 ',
  'H: 100% ',
  'S: 100% ',
  'M: 100% ',
  '$: 0 ',
]);

export const promptBox = new UiBox(LINE_LENGTH, 2, 1, 24, ({ input }) => [
  (prompt + input).padEnd(LINE_LENGTH, ' '),
]);
