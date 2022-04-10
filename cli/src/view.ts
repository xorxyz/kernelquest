import { esc, Screen, Style, CLOCK_MS_DELAY } from 'xor4-lib';
import { UiComponent } from './component';
import { VirtualTerminal } from './pty';

const CLEAR_RATE = CLOCK_MS_DELAY;

/** @category View */
export abstract class View {
  components: Record<string, UiComponent>;

  compile(pty: VirtualTerminal, tick: number): string {
    const lines = Object.values(this.components).sort((a, b) => a.z - b.z).map((component) =>
      component.compile(pty, tick) + esc(Style.Reset));

    const clear = pty.player.mind.tick % CLEAR_RATE === 0
      ? esc(Screen.Clear)
      : '';

    return clear + lines.join('');
  }
}
