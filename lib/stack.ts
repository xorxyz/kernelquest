export class Stack<T> extends Array {
  clear() {
    this.length = 0;
  }

  /** pop multiple values */
  popN(n) {
    const items: Array<any> = [];

    for (let i = 0; i < n; i++) {
      const item = this.pop();
      items.push(item);
    }

    return items;
  }

  /** peek at the value on top of the stack */
  peek() {
    return this[this.length - 1];
  }

  peekN(n: number) {
    return this[n];
  }
}
