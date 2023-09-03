import { ActionArguments } from '../shared/interfaces';
import { InterpretMeaningFn, WordArguments } from './meaning';

// export type Meaning = (stack: Stack) => IAction | null

export class Dictionary {
  private meanings = new Map<string, InterpretMeaningFn<WordArguments | ActionArguments>>();

  static from(
    obj: Record<string, InterpretMeaningFn<WordArguments | ActionArguments>>,
  ): Dictionary {
    const dict = new Dictionary();
    Object.entries(obj).forEach(([key, value]) => {
      dict.add(key, value);
    });
    return dict;
  }

  add(name: string, action: InterpretMeaningFn<WordArguments | ActionArguments>): void {
    this.meanings.set(name, action);
  }

  get(name: string): InterpretMeaningFn<WordArguments | ActionArguments> | null {
    return this.meanings.get(name) ?? null;
  }

  remove(name: string): void {
    this.meanings.delete(name);
  }

  list(): [string, InterpretMeaningFn<WordArguments | ActionArguments>][] {
    return [...this.meanings.entries()];
  }

  combine(dict: Dictionary): void {
    dict.list().forEach(([key, value]) => {
      this.add(key, value);
    });
  }
}
