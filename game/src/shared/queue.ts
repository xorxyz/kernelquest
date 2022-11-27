export class Queue<T> {
  items: Array<T> = [];
  get size() { return this.items.length; }
  add(item: T) { this.items.push(item); }
  next(): T | null { return this.items.shift() || null; }
  peek(): T | null { return this.items[0] || null; }
}

export class PriorityQueue<T> {
  items: Map<T, number> = new Map();

  /* adds an item in the queue */
  put(item: T, priority: number) {
    this.items.set(item, priority);
  }

  /* returns lowest priority item */
  get() {
    const sorted = Array.from(this.items.entries()).sort((a, b) => a[1] - b[1]);
    const item = sorted[0][0];

    this.items.delete(item);

    return item;
  }

  isEmpty() {
    return this.items.size === 0;
  }
}
