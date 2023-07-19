import { Component } from './component';
import { InputEvent } from './events';
import { IAction } from './interfaces';
import { Queue } from './queue';

type ViewEventHandler = (inputEvent: InputEvent) => void

export interface IRouter {
  go: (name: string) => void
}

export abstract class View {
  protected router: IRouter;

  protected actions = new Queue<IAction>();

  private components: Record<string, Component> = {};

  private events: Record<string, ViewEventHandler> = {};

  constructor(router: IRouter) {
    this.router = router;
  }

  onLoad?(tick: number): void

  update?(tick: number): IAction | null

  render(): string {
    const output = Object.values(this.components).map((component): string => component.$render());

    return output.join('');
  }

  registerComponent(name: string, component: Component): Component {
    if (this.components[name]) {
      throw new Error(`registerComponent(): component '${name}' already exists.`);
    }
    this.components[name] = component;
    return component;
  }

  registerEvent(name: string, handler: ViewEventHandler): ViewEventHandler {
    if (this.events[name]) {
      throw new Error(`registerEvent(): handler for event '${name}' already exists.`);
    }
    this.events[name] = handler;
    return handler;
  }

  $update(tick: number, inputEvents: InputEvent[]): IAction | null {
    inputEvents.forEach((event): void => {
      const handler = this.events[event.name];
      if (handler) {
        handler.call(this, event);
      }
    });

    return this.update
      ? this.update(tick)
      : null;
  }
}
