import { esc, Screen, Style } from 'xor4-lib/esc';
import { CLOCK_MS_DELAY } from 'xor4-game/constants';
import { UiComponent } from './component';

const CLEAR_RATE = CLOCK_MS_DELAY;

/** @category View */
export abstract class View {
  components: Record<string, UiComponent>;

  compile(terminal, tick: number): string {
    const lines = Object.values(this.components).map((component) =>
      component.compile(terminal, tick) + esc(Style.Reset));

    const clear = terminal.connection.player.mind.tick % CLEAR_RATE === 0
      ? esc(Screen.Clear)
      : '';

    return clear + lines.join('');
  }
}
