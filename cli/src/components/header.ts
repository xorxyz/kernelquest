import { esc, Style } from 'xor4-lib/esc';
import { SCREEN_WIDTH, UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

/** @category Components */
export class Header extends UiComponent {
  style = esc(Style.Invert);
  render({ place }: VirtualTerminal) {
    return [(
      `🏰 Kernel Quest                                  👑 ${place.capturedCrowns.size}/${place.crowns.size}  🚩 ${place.capturedFlags.size}/${place.flags.size}  ⏳ ${String(place.secondsLeft).padStart(3, '0')}`
    ).padEnd(SCREEN_WIDTH - 1, ' ')];
  }
}
