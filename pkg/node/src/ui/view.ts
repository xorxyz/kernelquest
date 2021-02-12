/*
 * the engine generates a view to send to each player
 */
import * as term from './term';
import { IGameState } from './boxes';
import {
  navBox,
  outputBox,
  promptBox,
  roomBox,
  sideBox,
  statsBox,
  CURSOR_OFFSET,
} from './ui';

export function render(state: IGameState): string {
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
    term.cursor.setXY(CURSOR_OFFSET, 24),
  ].join('');
}
