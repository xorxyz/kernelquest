import { UiComponent } from '../component';

export class Message extends UiComponent {
  render() {
    return [
      '┌───────────────────┐',
      '│                   │',
      '│      Paused.      │',
      '│                   │',
      `${'└'.padEnd(20, '─')}┘`,
    ];
  }
}
