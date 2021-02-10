import { Vector } from '../../../lib/math';
import * as term from './term';

export interface IState {
  logs: Array<string>,
  input: string
}

export const MAX_LINE_LENGTH = 60;
export const prompt = '$ ';

export type RenderFn = (state: IState) => Array<string>

export class UiBox {
  pos: Vector
  size: Vector
  render: RenderFn

  constructor(x: number, y: number, w: number, h: number, renderFn: RenderFn) {
    this.pos = new Vector(x, y);
    this.size = new Vector(w, h);
    this.render = renderFn;
  }

  print(state) {
    const reset = term.cursor.setXY(this.pos.x, this.pos.y);
    const lines = this.render(state);
    const offset = (
      term.cursor.down(1) +
      term.line.start +
      term.cursor.right(this.pos.x - 1) +
      term.line.clearAfter
    );

    return (
      reset + lines.map((line) => line + offset).join('')
    );
  }
}

export const navBox = new UiBox(0, 0, 80, 1, () => [
  '^xor4:John @ King\'s Valley T 1st 1/4 moon, 2038',
]);

export const roomBox = new UiBox(18, 3, 16, 9, () => [
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

export const sideBox = new UiBox(18 + 32 + 13, 3, 10, 8, () => [
  '🧙',
  'name: John',
  'job: Wizard',
  '',
  '',
  'X: nothing',
  'Y: nothing',
  'A: nothing',
]);

export const outputBox = new UiBox(1, 13, MAX_LINE_LENGTH, 10, (state) => {
  const { logs } = state;

  return logs
    .slice(-10)
    .map((line) => line.padEnd(MAX_LINE_LENGTH, ' '));
});

export const statsBox = new UiBox(63, 17, 10, 10, () => [
  'L: 1',
  'X: 0 ',
  'H: 100% ',
  'S: 100% ',
  'M: 100% ',
  '$: 0 ',
]);

export const promptBox = new UiBox(1, 24, MAX_LINE_LENGTH, 1, ({ input }) => [
  (prompt + input).padEnd(MAX_LINE_LENGTH, ' '),
]);
