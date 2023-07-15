export class Queue<T> {
  items: Array<T> = [];

  get size(): number {
    return this.items.length;
  }

  add(item: T): void {
    this.items.push(item);
  }

  next(): T | null {
    return this.items.shift() || null;
  }

  peek(): T | null {
    return this.items[0] || null;
  }
}
