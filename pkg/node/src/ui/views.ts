import { esc, Style } from '../../lib/esc';
import { Terminal } from '../shell/shell';
import {
  UiComponent,
  Navbar,
  Sidebar,
  Axis,
  RoomMap,
  Stats,
  Output,
  Input,
  Scroll,
} from './components';

export abstract class View {
  components: Record<string, UiComponent>

  compile(term: Terminal): string {
    const lines = Object.values(this.components).map((component) =>
      component.compile(term) + esc(Style.Reset));

    return lines.join('');
  }
}

export const components = {
  // top
  nav: new Navbar(1, 1),
  // left side
  profile: new Sidebar(1, 3),
  // spells: new Scroll(3, 5),
  stats: new Stats(1, 15),
  // right side
  axis: new Axis(23, 3),
  room: new RoomMap(25, 4),
  output: new Output(20, 15),
  prompt: new Input(20, 21),
};

export class MainView extends View {
  components: Record<string, UiComponent> = components
}
