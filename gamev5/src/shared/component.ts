import { Vector } from './vector';

export abstract class Component {
  private position: Vector;

  constructor(position: Vector) {
    this.position = position;
  }

  $render(): string {
    return this.render();
  }

  abstract render(): string
}
