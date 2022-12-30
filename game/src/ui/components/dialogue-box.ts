import { Choice } from 'inkjs/engine/Choice';
import {
  esc, Keys, LINE_LENGTH, Style,
} from '../../shared';
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
export class DialogueBox extends UiComponent {
  selected = 0;
  options: Choice[] = [];
  up() {
    if (this.selected === 0) return;
    this.selected--;
  }
  down() {
    if (this.selected === this.options.length - 1) return;
    this.selected++;
  }
  select() {
    const selected = this.options[this.selected];
    return selected;
  }
  handleInput(str: string, pty: VirtualTerminal) {
    if (str === Keys.ARROW_UP) this.up();
    if (str === Keys.ARROW_DOWN) this.down();
    if (str === Keys.ENTER) {
      const selected = this.select();
      this.selected = 0;
      console.log(selected.index);
      if (selected.index === this.options.length - 1 || !pty.engine.story.canContinue) {
        pty.talking = false;
        console.log('done');
        return;
      }
      pty.engine.story.ChooseChoiceIndex(selected.index);
    }
  }
  render({ engine }: VirtualTerminal) {
    if (!engine.tty.talking) {
      return [''];
    }
    this.options = engine.story.currentChoices;

    const content = engine.story.currentText?.split('\n').concat([' '.padEnd(LINE_LENGTH - 4, ' ')]) || [];
    const choices = (this.options.map((c) => (this.selected === c.index
      ? `${esc(Style.Invert)}  * ${c.text.padEnd(LINE_LENGTH - 8, ' ')}${esc(Style.Reset)}`
      : `  * ${c.text.padEnd(LINE_LENGTH - 8)}`
    )));

    const logs = content.reduce((arr, log) => {
      const lines = formatLines(log);
      lines.forEach((line) => {
        if (!line) return;
        arr.push(line);
      });
      return arr;
    }, [] as Array<string>)
      .map((l) => l.padEnd(LINE_LENGTH - 4, ' '))
      .concat(choices)
      .concat(Array(4).fill(0).map(() => ''.padEnd(LINE_LENGTH - 4, ' ')));

    return [
      `╔${'═'.padEnd(LINE_LENGTH - 2, '═')}╗`,
      ...logs
        .map((line) => `║ ${(line || '')} ║`),
      `╚${'═'.padEnd(LINE_LENGTH - 2, '═')}╝`,
    ];
  }
}
