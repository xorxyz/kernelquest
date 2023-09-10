import { Component } from '../component';
import { IKeyboardEvent } from '../../shared/interfaces';
import { IEngineState } from '../../state/valid_state';

export class DiagnosticsComponent extends Component {
  private lastKeyboardEvent: IKeyboardEvent = {
    altKey: false,
    ctrlKey: false,
    shiftKey: false,
    code: '',
    key: '',
    keyCode: 0,
  };

  private ticks = '0';

  private stack = '[]';

  update(state: IEngineState, keyboardEvents: IKeyboardEvent[]): void {
    this.ticks = String(state.game.tick).padStart(16, '0');
    this.lastKeyboardEvent = keyboardEvents.slice(-1)[0] ?? this.lastKeyboardEvent;
    this.stack = `[${state.shell.printStack()}]`;
  }

  render(): string[] {
    return [
      this.ticks,
      this.stack,
      this.formatKeyCombo(),
    ];
  }

  private formatKeyCombo(): string {
    return [
      this.lastKeyboardEvent.ctrlKey ? 'ctrl' : '',
      this.lastKeyboardEvent.shiftKey ? 'shift' : '',
      this.lastKeyboardEvent.altKey ? 'alt' : '',
      this.lastKeyboardEvent.code,
    ].filter((x): boolean => x !== '').join('+');
  }
}
