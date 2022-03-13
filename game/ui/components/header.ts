import { esc, Style } from 'xor4-lib/esc';
import { SCREEN_WIDTH, UiComponent } from '../components';
import { TTY } from '../tty';

export class Header extends UiComponent {
  style = esc(Style.Invert);
  render(tty: TTY) {
    return [(
      `🏰 Kernel Quest                                  👑 ${tty.place.capturedCrowns.size}/${tty.place.crowns.size}  🚩 ${tty.place.capturedFlags.size}/${tty.place.flags.size}  ⏳ ${String(tty.place.secondsLeft).padStart(3, '0')}`
    ).padEnd(SCREEN_WIDTH - 1, ' ')];
  }
}
