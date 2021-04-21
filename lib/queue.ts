export class Queue<T> extends Array {
  add(item: T) { this.unshift(item); }
  next(): T { return this.pop(); }
}
