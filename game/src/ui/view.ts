import { Component } from './component';
import { IAction, IKeyboardEvent } from '../shared/interfaces';
import { Queue } from '../shared/queue';
import { Vector } from '../shared/vector';
import { Ansi } from './ansi';
import { DiagnosticsComponent } from './components/diagnostics';
import { EveryAction } from '../world/actions';
import { IGameState } from '../state/valid_state';
import { Runtime } from '../scripting/runtime';
import { Area } from '../world/area';

type ViewEventHandler = (inputEvent: InputEvent) => void

export interface ICutTransition {
  type: 'cut'
}

export interface IFadeTransition {
  type: 'fade'
  delay?: number,
  duration?: number
}

export type ITransition = ICutTransition | IFadeTransition

export interface IRouter {
  go: (name: string, transition?: ITransition) => void
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface View {
  onLoad?(tick: number): void

  update?(tick: number, shell: Runtime, state: IGameState, keyboardEvents: IKeyboardEvent[], area: Area): EveryAction | null
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export abstract class View {
  protected actions = new Queue<IAction>();

  protected router: IRouter;

  private activeComponent: Component;

  private components: Record<string, Component> = {};

  private events: Record<string, ViewEventHandler> = {};

  constructor(router: IRouter) {
    this.router = router;
    // this.activeComponent = this.registerComponent('diagnostics', new DiagnosticsComponent(new Vector(0, 0)));
  }

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

  registerComponent<T extends Component>(name: string, component: T): T {
    if (this.components[name]) {
      throw new Error(`registerComponent(): component '${name}' already exists.`);
    }
    this.components[name] = component;
    if (!this.activeComponent) this.activeComponent = component;
    return component;
  }

  registerEvent(name: string, handler: ViewEventHandler): ViewEventHandler {
    if (this.events[name]) {
      throw new Error(`registerEvent(): handler for event '${name}' already exists.`);
    }
    this.events[name] = handler;
    return handler;
  }

  $update(tick: number, shell: Runtime, state: IGameState, keyboardEvents: IKeyboardEvent[], area: Area): EveryAction | null {
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
      const viewAction = this.update(tick, shell, state, keyboardEvents, area);
      if (viewAction) return viewAction;
    }

    Object.values(this.components).forEach((component): void => {
      component.$update(shell, state, keyboardEvents, area);
    });

    return this.activeComponent.queue.next();
  }
}
