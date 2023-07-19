import { IKeyboardEvent } from './interfaces';

export class InputEvent {
  readonly name: string;

  constructor(event: IKeyboardEvent) {
    const combination: string[] = [
      event.ctrlKey ? 'ctrl' : '',
      event.altKey ? 'alt' : '',
      event.shiftKey ? 'shift' : '',
      event.key,
    ].filter((x): x is string => Boolean(x));

    this.name = `key:${combination.join('+')}`;
  }
}
