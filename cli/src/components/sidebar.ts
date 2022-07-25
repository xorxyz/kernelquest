import { esc, Style } from 'xor4-lib/esc';
import { UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

const nothing = (n) => `${esc(Style.Dim)}${'nothing.'.padEnd(n, ' ')}${esc(Style.Reset)}`;

/** @category Components */
export class Sidebar extends UiComponent {
  render({ agent }: VirtualTerminal) {
    return [
      '┌───────────────────┐',
      `│ name: ${agent.name.padEnd(11)} │`,
      `│  job: ${(`${agent.type.glyph?.value} ${agent.type.name}`).padEnd(11)} │`,
      `│ hand: ${(agent.hand?.label || nothing(11)).padEnd(11)} │`,
      `│ eyes: ${(agent.eyes?.label || nothing(11)).padEnd(11)} │`,
      `│ feet: ${(`[${agent.position.label} ref]`).padEnd(11)} │`,
      '│                   │',
      '│ inventory:        │',
      `│  1. ${nothing(0)}      │`,
      `│  2. ${nothing(0)}      │`,
      `│  3. ${nothing(0)}      │`,
      '│                   │',
      '└───────────────────┘',
    ];
  }
}
