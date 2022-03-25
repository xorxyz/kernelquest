import { esc, Style } from 'xor4-lib/esc';
import { UiComponent } from '../component';
import { TTY } from '../tty';

const nothing = (n) => `${esc(Style.Dim)}${'nothing.'.padEnd(n, ' ')}${esc(Style.Reset)}`;

/** @category Components */
export class Sidebar extends UiComponent {
  render({ player }: TTY) {
    return [
      '┌───────────────────┐',
      `│ name: ${player.name.padEnd(11)} │`,
      `│ path: ${(`${player.glyph?.value} ${player.type.name}`).padEnd(11)} │`,
      `│ hand: ${(player.hand?.label || nothing(11)).padEnd(11)} │`,
      `│ eyes: ${(player.eyes?.label || nothing(11)).padEnd(11)} │`,
      `│ feet: ${(`[${player.position.label} ref]`).padEnd(11)} │`,
      '│                   │',
      '│                   │',
      '│                   │',
      '│                   │',
      '│                   │',
      '│                   │',
      '└───────────────────┘',
    ];
  }
}
