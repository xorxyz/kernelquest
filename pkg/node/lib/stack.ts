export class Stack<T> {
  list: Array<T>

  constructor() {
    this.list = [];
  }

  clear() {
    this.list.length = 0;
  }

  concat() {
    return this.list.join(' ');
  }

  /** pop multiple values */
  popN(n) {
    const items: Array<any> = [];

    for (let i = 0; i < n; i++) {
      const item = this.list.pop();
      items.push(item);
    }

    return items;
  }

  /** peek at the value on top of the stack */
  peek() {
    return this.list[this.length - 1];
  }

  peekN(n: number) {
    return this.list[n];
  }

  push(value: T) {
    this.list.push(value);
  }

  pop() {
    return this.list.pop();
  }

  get length() {
    return this.list.length;
  }
}
