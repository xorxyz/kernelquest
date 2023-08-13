import { Atom } from './atom';

export class Stack {
  private items: Atom[] = [];

  push(atom: Atom): void {
    this.items.push(atom);
  }

  pop(): Atom | undefined {
    return this.items.pop();
  }

  peek(): Atom | undefined {
    return this.items[this.items.length - 1];
  }

  peekN(n: number): Atom | undefined {
    return this.items[n];
  }

  print(): string {
    return this.items.map((atom: Atom): string => atom.toString()).join(' ');
  }
}
