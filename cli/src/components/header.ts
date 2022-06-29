import { esc, Style } from 'xor4-lib/esc';
import { SCREEN_WIDTH, UiComponent } from '../component';

/** @category Components */
export class Header extends UiComponent {
  style = esc(Style.Invert);
  render() {
    return [(
      `🏰 Kernel Quest                                          👑 ${0}/${0}  🚩 ${0}/${0}  ⏳ ${String(700).padStart(3, '0')}`
    ).padEnd(SCREEN_WIDTH - 1, ' ')];
  }
}
