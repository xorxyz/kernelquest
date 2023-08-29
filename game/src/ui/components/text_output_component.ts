import { Vector } from '../../shared/vector';
import { IGameState } from '../../state/valid_state';
import { Component } from '../component';

export class TextOutputComponent extends Component {
  linesOfText: string[] = [];

  constructor(v: Vector, text?: string) {
    super(v);
    if (text) {
      this.linesOfText.push(text);
    }
  }

  update(gameState: IGameState): void {
    this.linesOfText = [...gameState.terminalText];
  }

  render(): string[] {
    return this.linesOfText;
  }
}
