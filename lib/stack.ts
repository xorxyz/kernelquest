export class Stack<T> extends Array {
  clear() {
    this.length = 0;
  }

  /** pop multiple values */
  popN(n): Array<T> {
    const items: Array<T> = [];

    for (let i = 0; i < n; i++) {
      const item = this.pop();
      items.push(item);
    }

    return items;
  }

  /** peek at the value on top of the stack */
  peek(): T | null {
    return this[this.length - 1] || null;
  }

  peekN(n: number): T | null {
    return this[n] || null;
  }
}
