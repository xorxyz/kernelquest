import { Atom } from './atom';

export class Stack {
  private items: Atom[] = [];

  get size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items.splice(0, this.items.length);
  }

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

  popN(n: number): Atom[] {
    const atoms: Atom[] = [];
    new Array(n).fill(0).forEach(() => {
      const atom = this.pop();
      if (atom) atoms.push(atom);
    });

    return atoms;
  }

  print(): string {
    return this.items.map((atom: Atom): string => atom.toString()).join(' ');
  }
}
