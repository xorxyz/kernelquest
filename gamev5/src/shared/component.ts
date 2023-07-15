import { Vector } from './vector';

export abstract class Component {
  abstract render(): string

  private position: Vector;

  constructor(position: Vector) {
    this.position = position;
  }

  $render(): string {
    return this.render();
  }
}
