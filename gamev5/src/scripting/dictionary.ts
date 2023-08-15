import { IAction } from '../shared/interfaces';
import { Stack } from './stack';
import { clear } from './words/actions';
import { pop } from './words/operators';

export type Word = (stack: Stack) => IAction | null

export class Dictionary {
  private actions = new Map<string, Word>();

  constructor() {
    this.add('pop', pop);
    this.add('clear', clear);
  }

  add(name: string, action: Word): void {
    this.actions.set(name, action);
  }

  get(name: string): Word | null {
    return this.actions.get(name) ?? null;
  }

  remove(name: string): void {
    this.actions.delete(name);
  }
}
