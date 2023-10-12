import { Vector } from '../../shared/vector';
import { Component } from '../component';

export class TextLabelComponent extends Component {
  private text: string

  constructor(v: Vector, text: string) {
    super(v);
    this.text = text;
  }

  update(text: string) {
    this.text = text;
  }

  render(): string[] {
    return [this.text];
  }

  override getCursorOffset(): Vector {
    return new Vector(this.text.length + 1, 1);
  }
}
