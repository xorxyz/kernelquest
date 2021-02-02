export class Stack<T> {
  list: Array<T>

  push(value) {
    this.list.push(value);
  }

  pop() {
    return this.list.pop();
  }

  peek() {
    return this.list[this.length - 1];
  }

  get length() {
    return this.list.length;
  }
}
