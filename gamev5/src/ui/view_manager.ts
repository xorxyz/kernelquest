import { IAction, IKeyboardEvent, ITerminal } from '../shared/interfaces';
import { View } from '../shared/view';
import { BlankView } from './views/blank.view';

export class ViewManager {
  private activeView: View;
  private terminal: ITerminal;
  private tick = 0;
  private views: Map<string, View> = new Map();

  constructor(terminal: ITerminal) {
    this.terminal = terminal;
    this.activeView = this.registerView('blank', new BlankView({ go: this.go.bind(this) }));
  }

  registerView(name: string, view: View): View {
    this.views.set(name, view);
    return view;
  }

  render(): void {
    const output = this.activeView.render();
    this.terminal.write(output);
  }

  go(name: string): void {
    if (!this.views.has(name)) {
      throw new Error(`viewManager.go(): View '${name}' does not exist.`);
    }

    this.activeView = this.views.get(name);

    if (this.activeView.onLoad) this.activeView.onLoad(this.tick);
  }

  update(tick: number, keyboardEvents: IKeyboardEvent[]): IAction | null {
    this.tick = tick;

    const action = this.activeView.$update(tick, keyboardEvents);

    return action;
  }
}
