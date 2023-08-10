import { Component } from '../shared/component';
import { IAction, IKeyboardEvent } from '../shared/interfaces';
import { Queue } from '../shared/queue';
import { Vector } from '../shared/vector';
import { IGameState } from '../state/state_manager';
import { Ansi } from './ansi';
import { DiagnosticsComponent } from './components/diagnostics';

type ViewEventHandler = (inputEvent: InputEvent) => void

export interface IRouter {
  go: (name: string) => void
}

export abstract class View {
  protected actions = new Queue<IAction>();

  protected router: IRouter;

  private activeComponent: Component;

  private components: Record<string, Component> = {};

  private events: Record<string, ViewEventHandler> = {};

  constructor(router: IRouter) {
    this.router = router;
    this.activeComponent = this.registerComponent('diagnostics', new DiagnosticsComponent(new Vector(0, 0)));
  }

  onLoad?(tick: number): void

  update?(tick: number, state: IGameState): IAction | null

  getCursorPosition(): Vector {
    return (this.activeComponent.getCursorOffset?.() ?? new Vector())
      .clone()
      .add(this.activeComponent.position);
  }

  focus(component: Component): void {
    this.activeComponent = component;
  }

  render(): string {
    const output = Object.values(this.components).map((component): string => {
      const { x, y } = component.position;

      return [
        Ansi.setXY(x, y),
        component.$render().map((line, i): string => `${Ansi.setXY(x, y + i + 1)}${line}`).join('\n'),
      ].join('');
    });

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

  $update(tick: number, state: IGameState, keyboardEvents: IKeyboardEvent[]): IAction | null {
    // inputEvents.forEach((event): void => {
    //   const handler = this.events[event.name];
    //   if (handler) {
    //     handler.call(this, event);
    //   }
    // });

    keyboardEvents.forEach((event): void => {
      if (event.key === '\t') {
        const components = Object.values(this.components);
        const index = components.findIndex((c): boolean => c === this.activeComponent);
        const next = components[index + 1] ?? components[0];
        if (next) {
          this.activeComponent = next;
        }
      }
    });

    if (this.update) {
      this.update(tick, state);
    }

    Object.values(this.components).forEach((component): void => {
      component.$update(state, keyboardEvents);
    });

    return null;
  }
}
