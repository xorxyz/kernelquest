import { Component } from '../component';
import { IKeyboardEvent } from '../../shared/interfaces';
import { isAlphaNumeric, isSpecialCharacter } from '../../shared/util';
import { Vector } from '../../shared/vector';
import { KeyCodes } from '../keys';
import { Runtime } from '../../scripting/runtime';
import { IGameState } from '../../state/valid_state';
import { Ansi } from '../ansi';

export const PROMPT_SIZE = 11;

export class TextInputComponent extends Component {
  private debugMode = false;

  private busyShell = false; 

  protected prompt = Ansi.fgColor('Green') + '3/3' + Ansi.fgColor('Gray') + ':' + Ansi.fgColor('Blue') + '[0 0]' + Ansi.reset() + '# ';

  private text = '';

  private cursorX = 0;

  override getCursorOffset(): Vector {
    return new Vector(PROMPT_SIZE + this.cursorX, 1)
    // return new Vector(this.prompt.length + this.cursorX, 1);
  }

  render(): string[] {
    const prompt = this.debugMode && this.busyShell ? '⌛' : this.prompt;

    return [
      prompt + this.text,
    ];
  }

  update(shell: Runtime, state: IGameState, keyboardEvents: IKeyboardEvent[]): void {
    this.debugMode = shell.isDebugEnabled();
    this.busyShell = !shell.done();

    keyboardEvents.forEach((event): void => {
      this.handleKeyboardEvent(event);
    });
  }

  private handleKeyboardEvent(event: IKeyboardEvent): void {
    const blocked = this.debugMode && this.busyShell
    if (blocked) return;

    if (isAlphaNumeric(event.key) || isSpecialCharacter(event.key)) {
      this.insert(event.key);
      return;
    }

    switch (event.keyCode) {
      case KeyCodes.DELETE:
        this.delete();
        break;
      case KeyCodes.ENTER:
        this.submit();
        break;
      case KeyCodes.BACKSPACE:
        this.backspace(event.altKey);
        break;
      case KeyCodes.ARROW_LEFT:
        this.left(event.ctrlKey);
        break;
      case KeyCodes.ARROW_RIGHT:
        this.right(event.ctrlKey);
        break;
        case KeyCodes.ARROW_UP:
          this.up();
          break;
        case KeyCodes.ARROW_DOWN:
          this.down();
          break;
      default:
        break;
    }
  }

  private submit(): void {
    this.emit('submit', { text: this.text });
    this.text = '';
    this.cursorX = 0;
  }

  private delete(): void {
    this.text = this.text.slice(0, this.cursorX) + this.text.slice(this.cursorX + 1);
  }

  private insert(key: string): void {
    this.text = this.text.slice(0, this.cursorX) + key + this.text.slice(this.cursorX);
    this.cursorX += 1;
  }

  private backspace(fullWord: boolean): void {
    if (!this.text.length) return;

    if (fullWord) {
      const previousLength = this.text.length;
      this.text = this.text.trimEnd().split(/\s+/g).slice(0, -1).join(' ');
      const nextLength = this.text.length;
      this.cursorX -= (previousLength - nextLength);
    } else {
      this.text = this.text.slice(0, -1);
      this.cursorX -= 1;
    }
  }

  private left(fullWord: boolean): void {
    if (this.cursorX === 0) return;

    // full word
    if (fullWord) {
      this.cursorX -= countToPreviousWord(this.text, this.cursorX);
    // single letter
    } else {
      this.cursorX -= 1;
    }
  }

  private right(fullWord: boolean): void {
    if (this.cursorX === this.text.length) return;

    // full word
    if (fullWord) {
      this.cursorX += countToNextWord(this.text, this.cursorX);
    // single letter
    } else {
      this.cursorX += 1;
    }
  }

  private up(): void {
    this.emit('up', {});
  }

  private down(): void {
    this.emit('down', {});
  }

  replace(text: string = '') {
    this.text = text;
    this.cursorX = text.length;
  }
}

// count backwards until i hit a space (or nothing)
function countWordSizeLeft(text: string, x: number): number {
  let char: string | undefined;
  let count = 0;
  while (char !== ' ') {
    count += 1;
    char = text[x - count];
    if (char === undefined) break;
  }
  return Math.max(0, count - 1);
}

// count backwards until i hit a non-space (or nothing)
function countSpaceSizeLeft(text: string, x: number): number {
  let char: string | undefined = ' ';
  let count = 0;
  while (char === ' ') {
    count += 1;
    char = text[x - count];
    if (char === undefined) break;
  }
  return Math.max(0, count - 1);
}

// count forward until i hit a space (or nothing)
function countWordSizeRight(text: string, x: number): number {
  let char: string | undefined;
  let count = 0;
  while (char !== ' ') {
    count += 1;
    char = text[x + count];
    if (char === undefined) break;
  }
  return Math.max(0, count - 1);
}

// count forward until i hit a non-space (or nothing)
function countSpaceSizeRight(text: string, x: number): number {
  let char: string | undefined = ' ';
  let count = 0;
  while (char === ' ') {
    count += 1;
    char = text[x + count];
    if (char === undefined) {
      count += 1;
      break;
    }
  }
  return Math.max(0, count - 1);
}

function countToPreviousWord(text: string, x: number): number {
  if (text[x - 1] !== ' ') {
    return countWordSizeLeft(text, x);
  }

  const spaceSize = countSpaceSizeLeft(text, x);
  const wordSize = countWordSizeLeft(text, x - spaceSize);

  return spaceSize + wordSize;
}

function countToNextWord(text: string, x: number): number {
  if (text[x + 1] === ' ') {
    return countWordSizeRight(text, x);
  }

  const wordSize = countWordSizeRight(text, x);
  const spaceSize = countSpaceSizeRight(text, x + wordSize);

  return spaceSize + wordSize;
}
