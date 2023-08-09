import { InputEvent } from '../input/input_event';
import { IAction, ITerminal } from '../shared/interfaces';
import { IRouter, View } from './view';
import { IGameState } from '../state/state_manager';
import { BlankView } from './views/blank.view';

export class ViewManager {
  private activeView: View;

  private terminal: ITerminal;

  private tick = 0;

  private views = new Map<string, View>();

  private router = {
    go: this.go.bind(this),
  };

  constructor(terminal: ITerminal) {
    this.terminal = terminal;
    this.activeView = this.registerView('blank', BlankView);
  }

  render(): void {
    const output = this.activeView.render();
    this.terminal.write(output);
  }

  update(tick: number, state: IGameState, inputEvents: InputEvent[]): IAction | null {
    this.tick = tick;

    const action = this.activeView.$update(tick, state, inputEvents);

    return action;
  }

  private registerView(name: string, Ctor: new (router: IRouter) => View): View {
    const view = new Ctor(this.router);
    this.views.set(name, view);
    return view;
  }

  private go(name: string): void {
    if (!this.views.has(name)) {
      throw new Error(`viewManager.go(): View '${name}' does not exist.`);
    }

    this.activeView = this.views.get(name);

    if (this.activeView.onLoad) this.activeView.onLoad(this.tick);
  }
}
