import { Stack } from '../../lib/stack';
import { Program, Thing } from './things';

export type Memory = Array<Thing>
export type DataStack = Stack<Thing>

export class Execution {
  private level = 0
  private stacks: Array<any>
  private program: Program

  constructor(program: Program, stack: DataStack) {
    this.stacks = [stack];
    this.program = program;
  }

  get stack() {
    return this.stacks[this.level];
  }

  set stack(s) {
    this.stacks[this.level] = s;
  }

  start() {
    this.program.transforms.map((transform) =>
      transform.fn.call(this, this.stack));

    return this.stack.peek();
  }
}
