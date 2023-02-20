import { Colors, esc, Style } from '../../shared';
import { UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

/** @category Components */
const Points = (bg, n) => {
  const str = `${String(n).padStart(3, ' ')} / 10 `;

  return (
    esc(Style.in(Colors.Fg.Black, bg, str.slice(0, n)))
    + esc(Style.in(Colors.Fg.White, Colors.Bg.Black, str.slice(n)))
    + esc(Style.Reset)
  );
};

const Hp = (n) => Points(Colors.Bg.Red, n);
const Sp = (n) => Points(Colors.Bg.Green, n);
const Mp = (n) => Points(Colors.Bg.Cyan, n);

/** @category Components */
export class Stats extends UiComponent {
  render({ agent }: VirtualTerminal) {
    return [
      '┌───────────────────┐',
      '│ Level: 1          │',
      '│ Experience: 0     │',
      `│ Gold: ${String(agent.gp.value).padEnd(12, ' ')}│`,
      '│                   │',
      `│ Health:  ${Hp(agent.hp.value)}│`,
      `│ Stamina: ${Sp(agent.sp.value)}│`,
      `│ Magic:   ${Mp(agent.mp.value)}│`,
      '│                   │',
      `${'└'.padEnd(20, '─')}┘`,
    ];
  }

  handleInput() { throw new Error('Not implemented.'); }
}
