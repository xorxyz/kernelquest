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
import { UiBox } from './lib';

export abstract class View {
  abstract boxes: Record<string, UiBox>

  render(state: IShellState): string {
    return Object.values(this.boxes)
      .map((box) => box.render(state))
      .join('');
  }
}

export class MainView extends View {
  boxes = {
    nav: new NavBox(1, 1),
    room: new RoomBox(15, 4),
    side: new SideBox(LINE_LENGTH + 2, 4),
    output: new OutputBox(3, 16),
    stats: new StatsBox(LINE_LENGTH + 2, 16),
    prompt: new PromptBox(1, 24),
  }
}
