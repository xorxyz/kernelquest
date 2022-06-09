import { esc, Style } from 'xor4-lib/esc';
import { SCREEN_WIDTH, UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

/** @category Components */
export class Header extends UiComponent {
  style = esc(Style.Invert);
  render({ area }: VirtualTerminal) {
    return [(
      `🏰 Kernel Quest                                  👑 ${area.capturedCrowns.size}/${area.crowns.size}  🚩 ${area.capturedFlags.size}/${area.flags.size}  ⏳ ${String(area.secondsLeft).padStart(3, '0')}`
    ).padEnd(SCREEN_WIDTH - 1, ' ')];
  }
}
