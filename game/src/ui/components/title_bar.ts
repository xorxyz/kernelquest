import { Component } from '../component';
import { IGameState } from '../../state/valid_state';
import { Runtime } from '../../scripting/runtime';
import { Ansi } from '../ansi';
import { SCREEN_WIDTH } from '../../shared/constants';

export class TitleBarComponent extends Component {
  private levelId = '1';
  private ticks = '0';
  private actions = '0';

  update(_: Runtime, state: IGameState): void {
    this.levelId = String(state.level.id);
    this.actions = String(state.history.length).padStart(8, '0');
    this.ticks = String(state.tick).padStart(16, '0');
  }

  render(): string[] {
    const left = `Kernel Quest. Level ${this.levelId}`;
    const right = `${this.actions}`.padStart(SCREEN_WIDTH - left.length, ' ')
    return [
      Ansi.bgColor('White') + Ansi.fgColor('Black') + left + right + Ansi.reset()
    ];
  }
}
