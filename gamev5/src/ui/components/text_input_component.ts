import { Component } from '../../shared/component';
import { IKeyboardEvent } from '../../shared/interfaces';
import { debug } from '../../shared/logger';
import { isAlphaNumeric, isSpecialCharacter } from '../../shared/util';
import { Vector } from '../../shared/vector';
import { IGameState } from '../../state/state_manager';
import { KeyCodes } from '../keys';

export class TextInputComponent extends Component {
  protected prompt = '# ';

  private text = '';

  private cursorX = 0;

  override getCursorOffset(): Vector {
    return new Vector(this.prompt.length + this.cursorX + 1, 1);
  }

  render(): string[] {
    return [
      this.prompt + this.text,
    ];
  }

  update(_: IGameState, keyboardEvents: IKeyboardEvent[]): void {
    keyboardEvents.forEach((event): void => {
      this.handleKeyboardEvent(event);
    });
  }

  private handleKeyboardEvent(event: IKeyboardEvent): void {
    if (isAlphaNumeric(event.key) ?? isSpecialCharacter(event.key)) {
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
