import { debug, LINE_LENGTH } from 'xor4-lib';
import { N_OF_LINES, UiComponent } from '../component';
import { VirtualTerminal } from '../pty';

function formatLines(str: string): Array<string> {
  const maxSize = LINE_LENGTH - 4;
  const yardstick = new RegExp(`.{${maxSize}}`, 'g'); // /.{10}/g;
  // default to the full string if it's shorter than the yardstick
  const pieces = str.match(yardstick) || [str];
  const accumulated = (pieces.length * maxSize);
  const modulo = str.length % accumulated;
  if (modulo) pieces.push(str.slice(accumulated));
  return pieces;
}

/** @category Components */
export class Output extends UiComponent {
  render({ player }: VirtualTerminal) {
    const logs = player.logs.reduce((arr, log) => {
      const lines = formatLines(log.message);
      lines.forEach((line) => arr.push(line));
      return arr;
    }, [] as Array<string>);

    return [
      `┌${'─'.padEnd(LINE_LENGTH - 2, '─')}┐`,
      ...logs
        .slice(-N_OF_LINES)
        .map((line) =>
          `│ ${(line || '').padEnd(LINE_LENGTH - 4)} │`),
    ];
  }
}

/** @category Components */
export class Input extends UiComponent {
  render({ state }: VirtualTerminal) {
    const { line, prompt } = state;

    return [
      `│ ${(prompt + line).padEnd(LINE_LENGTH - 4, ' ')} │`,
      `└${'─'.padEnd(LINE_LENGTH - 2, '─')}┘`,
    ];
  }
}
