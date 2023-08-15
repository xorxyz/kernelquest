/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { IGameState } from '../state/state_manager';
import { IKeyboardEvent } from '../shared/interfaces';
import { logger } from '../shared/logger';
import { Vector } from '../shared/vector';

export interface Component {
  getCursorOffset?(): Vector
}

export interface IEvent {

}

export type EventHandler = (event: IEvent) => void

export abstract class Component {
  readonly position: Vector;

  private handlers: Record<string, EventHandler> = {};

  constructor(position: Vector) {
    this.position = position;
  }

  emit(eventName: string, event: IEvent): void {
    const handler = this.handlers[eventName];
    if (handler) {
      handler(event);
    }
  }

  on(eventName: string, handler: EventHandler): void {
    if (this.handlers[eventName]) {
      logger.error(`Handler already exists for ${eventName}`);
      return;
    }
    this.handlers[eventName] = handler;
  }

  $update(state: IGameState, keyboardEvents: IKeyboardEvent[]): void {
    if (this.update) this.update(state, keyboardEvents);
  }

  $render(): string[] {
    return this.render();
  }

  abstract update?(state: IGameState, keyboardEvents: IKeyboardEvent[]): void

  abstract render(): string[]
}
