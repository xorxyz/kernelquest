export class Stack<T> {
  list: Array<T>

  constructor() {
    this.list = [];
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
