import { esc, Style } from 'xor4-lib/esc';
import { UiComponent } from '../component';
import { TTY } from '../tty';

/** @category Components */
export class Axis extends UiComponent {
  style = esc(Style.Dim);
  render() {
    const x = '  0 1 2 3 4 5 6 7 8 9 A B C D E F';
    const y = x.trim().split(' ');

    return [
      x,
      ...y.slice(0, 10),
    ];
  }
}

/** @category Components */
export class RoomMap extends UiComponent {
  render({ player, place }: TTY) {
    return place.render(player?.sees());
  }
}