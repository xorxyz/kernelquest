import { esc, Screen, Style } from '../../lib/esc';
import { CLOCK_MS_DELAY } from '../engine/constants';
import { Terminal } from './terminal';
import {
  UiComponent,
  Navbar,
  Sidebar,
  Axis,
  RoomMap,
  Stats,
  Output,
  Input,
  Speech,
} from './components';

const CLEAR_RATE = CLOCK_MS_DELAY;

export abstract class View {
  components: Record<string, UiComponent>

  compile(terminal: Terminal): string {
    const lines = Object.values(this.components).map((component) =>
      component.compile(terminal) + esc(Style.Reset));

    const clear = terminal.connection.player.cycle % CLEAR_RATE === 0
      ? esc(Screen.Clear)
      : '';

    return clear + lines.join('');
  }
}

export const components: Record<string, UiComponent> = {};

const nav = new Navbar(1, 1);
const profile = new Sidebar(1, 3);
const stats = new Stats(1, 16);
const output = new Output(22, 16);
const prompt = new Input(22, 24);
const axis = new Axis(23 + 5, 4);
const room = new RoomMap(axis.position.x + 2, axis.position.y + 1);
const speech = new Speech(room.position.x, room.position.y);

components.nav = nav;
components.profile = profile;
components.stats = stats;
components.output = output;
components.prompt = prompt;
components.axis = axis;
components.room = room;
components.speech = speech;

export class MainView extends View {
  components: Record<string, UiComponent> = components
}
