/*
 * the engine generates a view to send to each player
 */
import { Vector } from '../../lib/math';
import { prompt } from '../ui';
import * as ctrl from './control';

interface IState {
  logs: Array<string>,
  input: string
}

type RenderFn = (state: IState) => Array<string>

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
    const reset = ctrl.cursor.setXY(this.pos.x, this.pos.y);
    const lines = this.render(state);
    const offset = (
      ctrl.cursor.down(1) +
      ctrl.line.start +
      ctrl.cursor.right(this.pos.x - 1)
    );

    return (
      reset + lines.map((line) => line + offset).join('')
    );
  }
}

const navBox = new UiBox(0, 0, 80, 1, () => [
  '^xor4:John @ King\'s Valley T 1st 1/4 moon, 2038',
]);

const roomBox = new UiBox(0 + 16 + 6, 3, 16, 8, () => [
  '. . . . . . . .',
  '. . . . . . . .',
  '. . . . . . . .',
  '. . . . . . . .',
  '. . . . . . . .',
  '. . . . . . . .',
  '. . . . . . . .',
  '. . . . . . . .',
]);

const sideBox = new UiBox(18 + 32 + 13, 3, 10, 8, () => [
  '🧙',
  'name: John',
  'job: Wizard',
  '',
  '',
  'X: nothing',
  'Y: nothing',
  'A: nothing',
]);

const outputBox = new UiBox(0, 13, 60, 10, ({ logs }) => logs.slice(-10));

const statsBox = new UiBox(63, 17, 10, 10, () => [
  'L: 1',
  'X: 0 ',
  'H: 100% ',
  'S: 100% ',
  'M: 100% ',
  '$: 0 ',
]);

const promptBox = new UiBox(0, 24, 60, 1, ({ input }) => [
  prompt + input,
]);

export function render(state: IState): Array<string> {
  const commands = [
    navBox,
    roomBox,
    sideBox,
    outputBox,
    statsBox,
    promptBox,
  ].map((box) => box.print(state));

  commands.push(ctrl.cursor.setXY(3, 24));

  return commands;
}
