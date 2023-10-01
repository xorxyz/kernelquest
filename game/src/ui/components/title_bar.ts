import { Component } from '../component';
import { IGameState } from '../../state/valid_state';
import { Runtime } from '../../scripting/runtime';
import { Ansi } from '../ansi';
import { SCREEN_WIDTH } from '../../shared/constants';

export class TitleBarComponent extends Component {
  private ticks = '0';

  update(_: Runtime, state: IGameState): void {
    this.ticks = String(state.tick).padStart(16, '0');
  }

  render(): string[] {
    return [
      Ansi.bgColor('White') + Ansi.fgColor('Black') + this.ticks.padStart(SCREEN_WIDTH, ' ') + Ansi.reset()
    ];
  }
}
