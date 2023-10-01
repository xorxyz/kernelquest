import { Component } from '../component';
import { IGameState } from '../../state/valid_state';
import { Runtime } from '../../scripting/runtime';
import { SCREEN_WIDTH } from '../../shared/constants';

const margin = 2;
const brackets = 2;
const ellipse = 3;
const maxWidth = SCREEN_WIDTH - brackets - margin - ellipse;

export class StackBarComponent extends Component {
  private stack = '';

  update(shell: Runtime, state: IGameState): void {
    const stack = shell.printStack();
    const ellipse = stack.length >= maxWidth ? '...' : ''
    this.stack = ellipse + shell.printStack().slice(-maxWidth);
  }

  render(): string[] {
    return [
      `[${this.stack}]`
    ];
  }
}
