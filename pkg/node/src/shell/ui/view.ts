/*
 * the engine generates a view to send to each player
 */
import {
  IState, navBox, outputBox, promptBox, roomBox, sideBox, statsBox,
} from './boxes';
import * as ctrl from './control';

export function render(state: IState): Array<string> {
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
    ctrl.cursor.setXY(3, 24),
  ];
}
