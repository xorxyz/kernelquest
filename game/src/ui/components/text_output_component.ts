import { Vector } from '../../shared/vector';
import { IEngineState } from '../../state/valid_state';
import { Component } from '../component';

export class TextOutputComponent extends Component {
  linesOfText: string[] = [];

  constructor(v: Vector, text?: string) {
    super(v);
    if (text) {
      this.linesOfText.push(text);
    }
  }

  update(state: IEngineState): void {
    this.linesOfText = [...state.terminal.output];
  }

  render(): string[] {
    return this.linesOfText;
  }
}
