import { esc, Style } from '../../shared';
import { dingbatEmojis } from '../../shared/dingbat';
import { UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

const dingbatEmojisAsStr = dingbatEmojis.map((codePoint) => String.fromCodePoint(codePoint));

function padEnd(str: string, n) {
  if (dingbatEmojisAsStr.some((s) => str.startsWith(s))) {
    return str.padEnd(n + 1);
  }

  return str.padEnd(n);
}

const nothing = (n) => `${esc(Style.Dim)}${'Nothing.'.padEnd(n, ' ')}${esc(Style.Reset)}`;

/** @category Components */
export class Sidebar extends UiComponent {
  render({ agent }: VirtualTerminal) {
    return [
      '┌───────────────────┐',
      `│ Name: ${agent.name.padEnd(11)} │`,
      `│  Job: ${padEnd(agent.type.label, 12)}│`,
      `│ Hand: ${padEnd(agent.hand?.label || nothing(12), 12)}│`,
      `│ Eyes: ${padEnd(agent.eyes ? `${agent.eyes?.label}` : nothing(12), 12)}│`,
      `│ Feet: ${padEnd(`${agent.position.label}`, 12)}│`,
      '│                   │',
      '│ Inventory:        │',
      `│  1. ${padEnd(agent.inventory.peekN(0)?.label || nothing(14), 14)}│`,
      `│  2. ${padEnd(agent.inventory.peekN(1)?.label || nothing(14), 14)}│`,
      `│  3. ${padEnd(agent.inventory.peekN(2)?.label || nothing(14), 14)}│`,
      '│                   │',
      '└───────────────────┘',
    ];
  }

  handleInput() { throw new Error('Not implemented.'); }
}
