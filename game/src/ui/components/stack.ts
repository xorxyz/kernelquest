import { LINE_LENGTH, Ring } from '../../shared';
import { UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

/** @category Components */
export class StackPane extends UiComponent {
  render({ agent }: VirtualTerminal) {
    const isWaiting = agent.mind.interpreter.isBusy() && !agent.mind.interpreter.subinterpreter;
    const frame = agent.mind.tick % 2 === 0 ? '⏳' : '⌛';
    const icon = isWaiting ? frame : '  ';

    return [
      `${icon}[ ${agent.mind.interpreter.stack.toString().padEnd(LINE_LENGTH - 7).slice(-(LINE_LENGTH - 7))} ]`,
    ];
  }
}
