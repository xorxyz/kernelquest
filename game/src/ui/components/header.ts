import { CLOCK_MS_DELAY, esc, Style } from '../../shared';
import { SCREEN_WIDTH, UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

/** @category Components */
export class Header extends UiComponent {
  style = esc(Style.Invert);
  render({ agent }: VirtualTerminal) {
    return [(
      `🏰 Kernel Quest                                                    👑 ${0}/${0}  🚩 ${0}/${0}  ⏳ ${String(700 - ((agent.mind.tick * CLOCK_MS_DELAY) / 500).toFixed(0)).padStart(3, '0')}`
    ).padEnd(SCREEN_WIDTH - 1, ' ')];
  }
}
