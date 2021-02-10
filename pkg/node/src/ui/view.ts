/*
 * the engine generates a view to send to each player
 */
import {
  IState, navBox, outputBox, promptBox, roomBox, sideBox, statsBox,
} from './boxes';
import * as term from './term';

export function render(state: IState): string {
  const boxes = [
    navBox,
    roomBox,
    sideBox,
    outputBox,
    statsBox,
    promptBox,
  ];

  return [
    ...boxes.map((box) => box.print(state)),
    term.cursor.setXY(3, 24),
  ].join('');
}
