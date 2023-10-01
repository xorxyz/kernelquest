import { Runtime } from '../../scripting/runtime';
import { Vector } from '../../shared/vector';
import { Component } from '../component';

export class TextOutputComponent extends Component {
  linesOfText: string[] = [];

  constructor(v: Vector, text?: string) {
    super(v);
    if (text) {
      this.linesOfText.push(text);
    }
  }

  update(shell: Runtime): void {
    this.linesOfText = shell.getOutput();
  }

  render(): string[] {
    return this.linesOfText;
  }
}
