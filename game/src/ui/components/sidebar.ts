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
      `│ Eyes: ${(agent.eyes ? `${agent.eyes?.type.glyph.value} ${agent.eyes?.type.name}` : nothing(11)).padEnd(11)} │`,
      `│ Feet: ${(`[${agent.pwd}] [${agent.position.label}]`).padEnd(11)} │`,
      '│                   │',
      '│ Inventory:        │',
      `│  1. ${(agent.inventory.peekN(0)?.label || nothing(0)).padEnd(14)}│`,
      `│  2. ${(agent.inventory.peekN(1)?.label || nothing(0)).padEnd(14)}│`,
      `│  3. ${(agent.inventory.peekN(2)?.label || nothing(0)).padEnd(14)}│`,
      '│                   │',
      '└───────────────────┘',
    ];
  }
}
