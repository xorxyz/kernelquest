import { Colors, esc, Style } from 'xor4-lib/esc';
import { UiComponent } from '../component';
import { TTY } from '../tty';

const Points = (bg, n) => {
  const str = `${String(n).padStart(3, ' ')} / 10 `;

  return (
    esc(Style.in(Colors.Fg.Black, bg, str.slice(0, n))) +
    esc(Style.in(Colors.Fg.White, Colors.Bg.Black, str.slice(n))) +
    esc(Style.Reset)
  );
};

const Hp = (n) => Points(Colors.Bg.Red, n);
const Sp = (n) => Points(Colors.Bg.Green, n);
const Mp = (n) => Points(Colors.Bg.Cyan, n);

export class Stats extends UiComponent {
  render({ player: p }: TTY) {
    return [
      '┌───────────────────┐',
      '│ level: 1          │',
      '│ experience: 0     │',
      `│ gold: ${String(p.gp.value).padEnd(12, ' ')}│`,
      '│                   │',
      `│ health:  ${Hp(p.hp.value)}│`,
      `│ stamina: ${Sp(p.sp.value)}│`,
      `│ magic:   ${Mp(p.mp.value)}│`,
      '│                   │',
      `${'└'.padEnd(20, '─')}┘`,
    ];
  }
}
