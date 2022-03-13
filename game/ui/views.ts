import { esc, Screen, Style } from 'xor4-lib/esc';
import { TTY } from './tty';
import { UiComponent } from './components';
import { CLOCK_MS_DELAY } from '../constants';
import { Header } from './components/header';
import { Sidebar } from './components/sidebar';
import { Input, Output } from './components/term';
import { Axis, RoomMap } from './components/map';
import { Stats } from './components/stats';
import { Message } from './components/message';

const CLEAR_RATE = CLOCK_MS_DELAY;

export abstract class View {
  components: Record<string, UiComponent>;

  compile(terminal: TTY, tick: number): string {
    const lines = Object.values(this.components).map((component) =>
      component.compile(terminal, tick) + esc(Style.Reset));

    const clear = terminal.connection.player.tick % CLEAR_RATE === 0
      ? esc(Screen.Clear)
      : '';

    return clear + lines.join('');
  }
}

export const components: Record<string, UiComponent> = {};

const nav = new Header(1, 1);
const profile = new Sidebar(1, 3);
const stats = new Stats(1, 16);
const output = new Output(22, 16);
const prompt = new Input(22, 24);
const axis = new Axis(23 + 5, 4);
const room = new RoomMap(axis.position.x + 2, axis.position.y + 1);
const message = new Message(24, 10);

components.nav = nav;
components.profile = profile;
components.stats = stats;
components.output = output;
components.prompt = prompt;
components.axis = axis;
components.room = room;
components.message = message;

export class MainView extends View {
  components: Record<string, UiComponent> = components;
}

export class IntroView extends View {
  components = {
  };
}
