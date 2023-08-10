import { IGameState } from '../state/state_manager';
import { IKeyboardEvent } from './interfaces';
import { Vector } from './vector';

export abstract class Component {
  readonly position: Vector;

  constructor(position: Vector) {
    this.position = position;
  }

  $update(state: IGameState, keyboardEvents: IKeyboardEvent[]): void {
    if (this.update) this.update(state, keyboardEvents);
  }

  $render(): string[] {
    return this.render();
  }

  abstract getCursorOffset?(): Vector

  abstract update?(state: IGameState, keyboardEvents: IKeyboardEvent[]): void

  abstract render(): string[]
}
