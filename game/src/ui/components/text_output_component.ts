import { Runtime } from '../../scripting/runtime';
import { SCREEN_HEIGHT } from '../../shared/constants';
import { Vector } from '../../shared/vector';
import { Component } from '../component';

const titleBar = 1;
const stackBar = 1;
const margin = 4;
const maxHeight = SCREEN_HEIGHT - titleBar - stackBar - margin;

export class TextOutputComponent extends Component {
  linesOfText: string[] = [];

  constructor(v: Vector, text?: string) {
    super(v);
    if (text) {
      this.linesOfText.push(text);
    }
  }

  update(shell: Runtime): void {
    this.linesOfText = shell.getOutput().slice(-maxHeight);
  }

  render(): string[] {
    return this.linesOfText;
  }
}
