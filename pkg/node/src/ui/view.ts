import { IShellState } from '../shell/shell';
import {
  LINE_LENGTH,
  NavBox,
  RoomBox,
  SideBox,
  OutputBox,
  StatsBox,
  PromptBox,
} from './components';

export default class View {
  render(state: IShellState) {
    const boxes = [
      new NavBox(1, 1),
      new RoomBox(15, 4),
      new SideBox(LINE_LENGTH + 2, 4),
      new OutputBox(3, 16),
      new StatsBox(LINE_LENGTH + 2, 16),
      new PromptBox(1, 24),
    ];

    const output = [
      ...boxes.map((box) => box.render(state)),
    ].join('');

    return output;
  }
}
