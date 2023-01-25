import { esc, Style } from '../../shared';
import { SCREEN_WIDTH, UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

/** @category Components */
export class Header extends UiComponent {
  style = esc(Style.Invert);
  render({ agent }: VirtualTerminal) {
    return [(
      `🏰 Kernel Quest                                                  👑 ${0}/${0}  🚩 ${0}/${0}  ⏳ ${String(agent.mind.tick).padStart(5, '0')}`
    ).padEnd(SCREEN_WIDTH - 1, ' ')];
  }
}
