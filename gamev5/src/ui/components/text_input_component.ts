import { Component } from '../../shared/component';
import { IKeyboardEvent } from '../../shared/interfaces';
import { logger } from '../../shared/logger';
import { isAlphaNumeric, isSpecialCharacter } from '../../shared/util';
import { Vector } from '../../shared/vector';
import { IGameState } from '../../state/state_manager';

export const KEY_SPACE = ' ';
export const KEY_BACKSPACE = '\x7F';
export const KEY_ENTER = '\r';
export const PROMPT = '$ ';

export class TextInputComponent extends Component {
  private text = '';

  override getCursorOffset(): Vector {
    return new Vector(PROMPT.length + this.text.length + 1, 1);
  }

  render(): string[] {
    return [
      PROMPT + this.text,
    ];
  }

  update(_: IGameState, keyboardEvents: IKeyboardEvent[]): void {
    keyboardEvents.forEach((event): void => {
      this.handleKeyboardEvent(event);
    });
  }

  private handleKeyboardEvent(event: IKeyboardEvent): void {
    logger.debug(event);
    if (event.key === KEY_ENTER) {
      this.emit('submit', this.text);
      this.text = '';
    }

    if (isAlphaNumeric(event.key) || isSpecialCharacter(event.key)) {
      this.text += event.key;
    }

    if (event.key === KEY_SPACE) {
      this.text += event.key;
    }

    if (event.key === KEY_BACKSPACE) {
      // Erase word
      if (event.ctrlKey) {
        this.text = this.text.split(' ').slice(0, -1).join(' ');
        // Erase letter
      } else {
        this.text = this.text.slice(0, -1);
      }
    }
  }
}
