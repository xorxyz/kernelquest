import { Component } from '../../shared/component';
import { IGameState } from '../../state/state_manager';

export class ClockComponent extends Component {
  private text = '000';

  update(state: IGameState): void {
    this.text = String(state.tick);
  }

  render(): string {
    return this.text;
  }
}
