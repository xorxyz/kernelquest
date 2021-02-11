import { Vector } from '../../lib/math';
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

export const navBox = new UiBox(2, 0, 80, 1, () => [
  'xor4>    John @ King\'s Valley    1st 1/4 moon, 2038    0 points',
]);

export const roomBox = new UiBox(18, 4, 16, 9, () => [
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

export const sideBox = new UiBox(56, 4, 10, 8, () => [
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

export const outputBox = new UiBox(2, 16, MAX_LINE_LENGTH, 10, (state) => {
  const { logs } = state;

  return logs
    .slice(-8)
    .map((line) => line.padEnd(MAX_LINE_LENGTH, ' '));
});

export const statsBox = new UiBox(56, 18, 10, 10, () => [
  'L: 1',
  'X: 0 ',
  'H: 100% ',
  'S: 100% ',
  'M: 100% ',
  '$: 0 ',
]);

export const promptBox = new UiBox(2, 24, MAX_LINE_LENGTH, 1, ({ input }) => [
  (prompt + input).padEnd(MAX_LINE_LENGTH, ' '),
]);
