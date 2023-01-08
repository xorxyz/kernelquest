import { LINE_LENGTH } from '../../shared';
import { UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

/** @category Components */
export class StackPane extends UiComponent {
  render({ agent }: VirtualTerminal) {
    const frame = agent.mind.tick % 2 === 0 ? '⏳' : '⌛';
    const icon = agent.mind.interpreter.isDone() ? '  ' : frame;

    return [
      `${icon} [ ${agent.mind.interpreter.label.padEnd(LINE_LENGTH - 7).slice(-(LINE_LENGTH - 7))} ]`,
    ];
  }
}
