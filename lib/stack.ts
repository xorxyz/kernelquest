export class Stack<T> extends Array {
  clear() {
    this.length = 0;
  }

  pop (): T | undefined {
    return super.pop()
  }

  /** pop multiple values */
  popN(n): Array<T | undefined> {
    const items: Array<T | undefined> = [];

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
    return this[this.length - 1 - n] || null;
  }
}
