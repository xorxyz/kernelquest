import { UiComponent } from '../components';
import { TTY } from '../tty';

export class Message extends UiComponent {
  render(tty: TTY) {
    return [
      '┌───────────────────┐',
      '│                   │',
      '│      Paused.      │',
      '│                   │',
      `${'└'.padEnd(20, '─')}┘`,
    ];
  }
}
