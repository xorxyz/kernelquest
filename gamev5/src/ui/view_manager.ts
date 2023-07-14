import { ITerminal } from '../shared/interfaces';
import { View } from '../shared/view';
import { BlankView } from './views/blank.view';

export class ViewManager {
  private activeView: View;
  private terminal: ITerminal;
  private views: Map<string, View> = new Map();

  constructor(terminal: ITerminal) {
    this.terminal = terminal;
    this.activeView = this.registerView('blank', new BlankView());
  }

  transitionTo(name: string): boolean {
    if (!this.views.has(name)) return false;
    this.activeView = this.views.get(name);

    if (this.activeView.onLoad) this.activeView.onLoad();

    return true;
  }

  registerView(name: string, view: View): View {
    this.views.set(name, view);
    return view;
  }

  update(): void {
    Object.values(this.views).forEach((view): void => view.update());
  }

  render(): void {
    const output = this.activeView.render();
    this.terminal.write(output);
  }
}
