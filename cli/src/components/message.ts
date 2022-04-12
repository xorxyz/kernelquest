import { UiComponent } from '../component';

/** @category Components */
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
