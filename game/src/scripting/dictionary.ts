import { interpret } from './meaning';

export type InterpretFn = typeof interpret

export class Dictionary {
  private meanings = new Map<string, typeof interpret>();

  static from(
    obj: Record<string, InterpretFn>,
  ): Dictionary {
    const dict = new Dictionary();
    Object.entries(obj).forEach(([key, value]) => {
      dict.add(key, value);
    });
    return dict;
  }

  add(name: string, action: InterpretFn): void {
    this.meanings.set(name, action);
  }

  get(name: string): InterpretFn | null {
    return this.meanings.get(name) ?? null;
  }

  remove(name: string): void {
    this.meanings.delete(name);
  }

  list(): [string, InterpretFn][] {
    return [...this.meanings.entries()];
  }

  combine(dict: Dictionary): void {
    dict.list().forEach(([key, value]) => {
      this.add(key, value);
    });
  }
}
