import { IAction } from '../shared/interfaces';
import { Stack } from './stack';
import { clear } from './words/actions';
import { pop } from './words/operators';

export type Meaning = (stack: Stack) => IAction | null

export class Dictionary {
  private meanings = new Map<string, Meaning>();

  constructor() {
    this.add('pop', pop);
    this.add('clear', clear);
  }

  add(name: string, action: Meaning): void {
    this.meanings.set(name, action);
  }

  get(name: string): Meaning | null {
    return this.meanings.get(name) ?? null;
  }

  remove(name: string): void {
    this.meanings.delete(name);
  }
}
