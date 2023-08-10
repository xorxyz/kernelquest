import { Component } from '../../shared/component';
import { IKeyboardEvent } from '../../shared/interfaces';
import { logger } from '../../shared/logger';
import { isAlphaNumeric } from '../../shared/util';
import { Vector } from '../../shared/vector';
import { IGameState } from '../../state/state_manager';

export const KEY_SPACE = ' ';
export const KEY_BACKSPACE = '\x7F';

export class TextInputComponent extends Component {
  private text = '';

  getCursorOffset(): Vector {
    return new Vector(this.text.length + 1, 1);
  }

  update(_: IGameState, inputEvents: IKeyboardEvent[]): void {
    inputEvents.forEach((event): void => {
      logger.debug(event);
      if (event.key.length === 1) {
        if (isAlphaNumeric(event.key)) {
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
    });
  }

  render(): string[] {
    return [
      this.text,
    ];
  }
}
