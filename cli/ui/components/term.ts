import { LINE_LENGTH, N_OF_LINES, UiComponent } from '../component';
import { TTY } from '../tty';

export class Output extends UiComponent {
  render({ state }: TTY) {
    return [
      `┌${'─'.padEnd(LINE_LENGTH - 2, '─')}┐`,
      ...state.stdout
        .slice(-N_OF_LINES)
        .map((line) =>
          `│ ${(line || '').padEnd(LINE_LENGTH - 4, ' ')} │`),
    ];
  }
}

export class Input extends UiComponent {
  render({ state }: TTY) {
    const { line, prompt } = state;

    return [
      `│ ${(prompt + line).padEnd(LINE_LENGTH - 4, ' ')} │`,
      `└${'─'.padEnd(LINE_LENGTH - 2, '─')}┘`,
    ];
  }
}
