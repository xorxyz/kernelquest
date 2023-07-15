import { IKeyboardEvent, ITerminal } from '../shared/interfaces';
import { Queue } from '../shared/queue';

export class InputManager {
  private terminal: ITerminal;
  private keyboardEvents = new Queue<IKeyboardEvent>();

  constructor(terminal: ITerminal) {
    this.terminal = terminal;

    this.terminal.onKey(this.handleInput.bind(this));
  }

  pullKeyboardEvents(): IKeyboardEvent[] {
    const events: IKeyboardEvent[] = [];
    for (let i = 0; i < this.keyboardEvents.size; i++) {
      const event = this.keyboardEvents.next();
      if (event) events.push(event);
    }
    return events;
  }

  private handleInput(event: IKeyboardEvent): void {
    this.keyboardEvents.add(event);
  }
}
