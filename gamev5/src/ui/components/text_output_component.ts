import { Component } from '../../shared/component';
import { IGameState } from '../../state/state_manager';

export class TextOutputComponent extends Component {
  private linesOfText: string[] = [];

  update(gameState: IGameState): void {
  }

  push(text: string): void {
    this.linesOfText.push(text);
  }

  render(): string[] {
    return this.linesOfText;
  }
}
