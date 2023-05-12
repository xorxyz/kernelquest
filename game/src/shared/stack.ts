import { Factor } from '../interpreter';

export class Stack<T> {
  arr = [] as Array<T>;

  get length() {
    return this.arr.length;
  }

  map(fn) {
    return this.arr.map(fn);
  }

  slice(...args) {
    return this.arr.slice(...args);
  }

  push(...a: Array<T>) {
    this.arr.push(...a);
  }

  clear() {
    this.arr.length = 0;
  }

  pop(): T | undefined {
    return this.arr.pop();
  }

  /** pop multiple values */
  popN(n): Array<T> {
    const items: Array<T> = [];

    for (let i = 0; i < n; i++) {
      const item = this.pop();
      if (item) items.push(item);
    }

    return items;
  }

  /** peek at the value on top of the stack */
  peek(): T | null {
    return this.arr[this.arr.length - 1] || null;
  }

  peekN(n: number): T | null {
    return this.arr[this.arr.length - 1 - n] || null;
  }

  toString() {
    return this.arr.map((f) => (f instanceof Factor ? f.toString() : JSON.stringify(f))).join(' ');
  }
}
