export interface StateTransition {}
export interface State {}

export abstract class FSM {
  current: State
  states: Map<StateTransition, State>
}

export class Queue<T> extends Array {
  add(item: T) { this.unshift(item); }
  next(): T { return this.pop(); }
}

export abstract class Points {
  value: number = 100
  cap: number = 100

  increase(amount: number) {
    this.value = Math.min(this.value + amount, this.cap);
  }

  decrease(amount: number) {
    this.value = Math.max(this.value - amount, 0);
  }
}
