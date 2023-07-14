import { IKeyboardEvent, ITerminal } from '../shared/interfaces';

export class InputManager {
  private terminal: ITerminal;

  constructor(terminal: ITerminal) {
    this.terminal = terminal;

    this.terminal.onKey(this.handleInput.bind(this));
  }

  handleInput(event: IKeyboardEvent): void {
    // Do something with the input
  }
}
