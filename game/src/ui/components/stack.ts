import { LINE_LENGTH } from '../../shared';
import { UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

/** @category Components */
export class StackPane extends UiComponent {
  render({ agent }: VirtualTerminal) {
    return [
      agent.mind.interpreter.stackStr,
    ];
  }
}
