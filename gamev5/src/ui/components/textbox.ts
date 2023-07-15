import { Component } from '../../shared/component';
import { Vector } from '../../shared/vector';

export class TextBoxComponent extends Component {
  private text: string;

  constructor(position: Vector, text: string) {
    super(position);
    this.text = text;
  }

  render(): string {
    return this.text;
  }
}
