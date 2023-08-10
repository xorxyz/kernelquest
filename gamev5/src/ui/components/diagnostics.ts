import { Component } from '../../shared/component';
import { IKeyboardEvent } from '../../shared/interfaces';
import { IGameState } from '../../state/state_manager';

function prettyPrintKey(keyboardEvent: IKeyboardEvent): string {
  const ctrl = keyboardEvent.ctrlKey ? 'ctrl' : '';
  const shift = keyboardEvent.shiftKey ? 'shift' : '';
  const alt = keyboardEvent.altKey ? 'alt' : '';
  return [ctrl, shift, alt, keyboardEvent.key].filter((x): boolean => !!x).join('+');
}

export class DiagnosticsComponent extends Component {
  private ticks = '0';

  // private key = '';

  update(state: IGameState, keyboardEvents: IKeyboardEvent[]): void {
    this.ticks = String(state.tick).padStart(16, '0');
    // const lastKeyboardEvent = keyboardEvents.slice(-1)[0];
    // if (lastKeyboardEvent) {
    //   this.key = prettyPrintKey(lastKeyboardEvent);
    // }
  }

  render(): string[] {
    return [
      this.ticks,
      // this.key,
    ];
  }
}
