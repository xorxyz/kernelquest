import { Factor } from 'xor4-interpreter';
import { LINE_LENGTH } from 'xor4-lib';
import { UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

/** @category Components */
export class StackPane extends UiComponent {
  render({ player }: VirtualTerminal) {
    return [
      `  [ ${player.mind.stack.map((factor: Factor) => factor.toString()).join(' ').padEnd(LINE_LENGTH - 8)} ]`,
    ];
  }
}
