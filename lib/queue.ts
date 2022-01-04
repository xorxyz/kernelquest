export class Queue<T> extends Array {
  add(item: T) { this.push(item); }
  next(): T | null { return this.shift() || null; }
}
