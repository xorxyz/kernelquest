import { Component } from './component';
import { IAction, IKeyboardEvent } from './interfaces';
import { Queue } from './queue';

type ViewEventHandler = (keyboardEvent: IKeyboardEvent) => void

export interface IRouter {
  go: (name: string) => void
}

export abstract class View {
  abstract components: Record<string, Component>;
  abstract events: Record<string, ViewEventHandler>
  protected router: IRouter;
  protected actions = new Queue<IAction>();

  constructor(router: IRouter) {
    this.router = router;
  }

  onLoad?(tick: number): void
  update?(tick: number): IAction | null

  render(): string {
    const output = Object.values(this.components)
      .map((component): string => component.$render());

    return output.join('');
  }

  $update(tick: number, keyboardEvents: IKeyboardEvent[]): IAction | null {
    keyboardEvents.forEach((event): void => {
      const eventName = event.key;
      const handler = this.events[eventName];
      if (handler) handler.call(this, event);
    });

    if (this.update) {
      const action = this.update(tick);
      return action;
    }

    return null;
  }
}
