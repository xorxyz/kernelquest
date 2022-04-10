import { UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

/** @category Components */
export class Message extends UiComponent {
  render(pty: VirtualTerminal) {
    if (!pty.paused) return [];
    return [
      '┌───────────────────┐',
      '│                   │',
      '│      Paused.      │',
      '│                   │',
      `${'└'.padEnd(20, '─')}┘`,
    ];
  }
}
