import { Component } from '../../shared/component';
import { IKeyboardEvent } from '../../shared/interfaces';
import { IGameState } from '../../state/state_manager';

export class DiagnosticsComponent extends Component {
  private ticks = '0';

  private key = '';

  update(state: IGameState, keyboardEvents: IKeyboardEvent[]): void {
    this.ticks = String(state.tick).padStart(16, '0');
    const lastKeyboardEvent = keyboardEvents.slice(-1)[0];
    if (lastKeyboardEvent) {
      this.key = [
        lastKeyboardEvent.ctrlKey ? 'ctrl' : '',
        lastKeyboardEvent.shiftKey ? 'shift' : '',
        lastKeyboardEvent.altKey ? 'alt' : '',
        lastKeyboardEvent.code,
      ].filter((x): boolean => x !== '').join('+');
    }
  }

  render(): string[] {
    return [
      this.ticks,
      this.key,
    ];
  }
}
