import { IGameState } from '../state/state_manager';
import { Vector } from './vector';

export abstract class Component {
  readonly position: Vector;

  constructor(position: Vector) {
    this.position = position;
  }

  $update(state: IGameState): void {
    if (this.update) this.update(state);
  }

  $render(): string {
    return this.render();
  }

  abstract update?(state: IGameState): void

  abstract render(): string
}
