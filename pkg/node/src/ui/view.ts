import { IState } from '../shell/shell';
import {
  navBox,
  outputBox,
  promptBox,
  roomBox,
  sideBox,
  statsBox,
} from './components';

export default class View {
  render(state: IState) {
    const boxes = [
      navBox,
      roomBox,
      sideBox,
      outputBox,
      statsBox,
      promptBox,
    ];

    const output = [
      ...boxes.map((box) => box.render(state)),
    ].join('');

    return output;
  }
}
