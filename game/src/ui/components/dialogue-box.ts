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
  currentText: string[] = [];
  options: Choice[] = [];
  up() {
    if (!this.options.length) return;
    if (this.selected === 0) return;
    this.selected--;
  }
  down() {
    if (!this.options.length) return;
    if (this.selected === this.options.length - 1) return;
    this.selected++;
  }
  select() {
    const selected = this.options[this.selected];
    return selected;
  }
  next(pty:VirtualTerminal) {
    const next = pty.engine.story.Continue();
    console.log('next:', next);
    this.currentText.push(next || '');
    console.log(this.currentText);
  }

  reset() {
    this.currentText = [];
    this.options = [];
    this.selected = 0;
  }

  handleInput(str: string, pty: VirtualTerminal) {
    if (str === Keys.ARROW_UP) this.up();
    if (str === Keys.ARROW_DOWN) this.down();
    if (str === Keys.ENTER) {
      // Pull more text
      if (pty.engine.story.canContinue) {
        console.log('can continue');
        this.next(pty);
        return;
      }

      // Pull options
      if (!this.options.length && pty.engine.story.currentChoices.length) {
        console.log('need options');
        this.options = pty.engine.story.currentChoices;
        return;
      }

      // Select an option
      if (this.options.length) {
        console.log('select an option');
        const selected = this.select();
        pty.engine.story.ChooseChoiceIndex(selected.index);

        this.reset();

        this.next(pty);
        return;
      }

      // Finish
      console.log('we are done');
      this.reset();
      pty.talking = false;
    }
  }
  render(pty: VirtualTerminal) {
    if (!pty.talking) {
      return [''];
    }

    const content = this.currentText.length
      ? this.currentText.join('')
      : pty.engine.story.currentText || '';

    const choices = (this.options.map((c) => (this.selected === c.index
      ? `${esc(Style.Invert)}  * ${c.text.padEnd(LINE_LENGTH - 8, ' ')}${esc(Style.Reset)}`
      : `  * ${c.text.padEnd(LINE_LENGTH - 8)}`
    )));

    const formatted = content.split('\n')
      .flatMap((l) => formatLines(l))
      .filter((x) => x);

    const logs = formatted
      .map((l) => l.padEnd(LINE_LENGTH - 4, ' '))
      .slice(-(8 - choices.length))
      .concat(['\n'])
      .concat(choices)
      .concat(new Array(Math.max((8 - choices.length - formatted.length), 0)).fill('').map((l) => l.padEnd(LINE_LENGTH - 4, ' ')));

    return [
      `╔${'═'.padEnd(LINE_LENGTH - 2, '═')}╗`,
      ...logs
        .map((line) => `║ ${(line || '')} ║`),
      `╚${'═'.padEnd(LINE_LENGTH - 2, '═')}╝`,
    ];
  }
}
