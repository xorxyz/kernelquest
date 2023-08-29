import { esc, Style } from '../../shared';
import { UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

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

  handleInput() { throw new Error('Not implemented.'); }
}

/** @category Components */
export class RoomMap extends UiComponent {
  render({ rendered }: VirtualTerminal) {
    return rendered;
  }

  handleInput() { throw new Error('Not implemented.'); }
}
