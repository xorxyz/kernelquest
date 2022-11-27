import { esc, Style } from '../../shared';
import { UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

const nothing = (n) => `${esc(Style.Dim)}${'Nothing.'.padEnd(n, ' ')}${esc(Style.Reset)}`;

/** @category Components */
export class Sidebar extends UiComponent {
  render({ agent }: VirtualTerminal) {
    return [
      '┌───────────────────┐',
      `│ Name: ${agent.name.padEnd(11)} │`,
      `│  Job: ${(`${agent.type.glyph?.value} ${agent.type.name}`).padEnd(11)} │`,
      `│ Hand: ${(agent.hand?.label || nothing(11)).padEnd(11)} │`,
      `│ Eyes: ${(agent.eyes?.label || nothing(11)).padEnd(11)} │`,
      `│ Feet: ${(`[${agent.position.label} ref]`).padEnd(11)} │`,
      '│                   │',
      '│ Inventory:        │',
      `│  1. ${nothing(0)}      │`,
      `│  2. ${nothing(0)}      │`,
      `│  3. ${nothing(0)}      │`,
      '│                   │',
      '└───────────────────┘',
    ];
  }
}
