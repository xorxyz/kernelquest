import Connection from '../server/connection';
import {
  UiComponent,
  Navbar,
  Sidebar,
  Axis,
  RoomMap,
  Stats,
  Output,
  Input,
} from './components';

export abstract class View {
  abstract boxes: Record<string, UiComponent>

  render(connection: Connection): string {
    return Object.values(this.boxes)
      .map((box) => box.render(connection))
      .join('');
  }
}

export const boxes = {
  nav: new Navbar(1, 1),
  side: new Sidebar(2, 3),
  axis: new Axis(22, 2),
  room: new RoomMap(25, 4),
  stats: new Stats(2, 15),
  output: new Output(16, 15),
  prompt: new Input(16, 20),
};

export const CURSOR_OFFSET_X = boxes.prompt.position.x + 2;
export const CURSOR_OFFSET_Y = boxes.prompt.position.y;

export class MainView extends View {
  boxes = boxes
}
