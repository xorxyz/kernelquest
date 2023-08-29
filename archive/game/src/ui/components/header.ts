import { esc, Style } from '../../shared';
import { SCREEN_WIDTH, UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

/** @category Components */
export class Header extends UiComponent {
  style = esc(Style.Invert);
  render({ engine }: VirtualTerminal) {
    return [(
      `🏰 Kernel Quest                                                👑 ${0}/${0}  🚩 ${0}/${0}  ⏳ ${engine.cycle.toString(16).padStart(5, ' ')}`
    ).padEnd(SCREEN_WIDTH - 3, ' ')];
  }

  handleInput() { throw new Error('Not implemented.'); }
}
