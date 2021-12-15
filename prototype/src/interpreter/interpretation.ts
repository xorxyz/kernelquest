import { Stack } from "../../../lib/stack";
import { Word } from "./compiler";

export interface IProgram {
  words: Array<Word>
}

export class Interpretation {
  private level = 0
  private stacks: Array<any>
  private program: IProgram

  constructor(program: IProgram) {
    this.program = program;
  }

  get stack(): Stack<Word> {
    return this.stacks[this.level];
  }

  set stack(s) {
    this.stacks[this.level] = s;
  }

  start(stack: Stack<Word>) {
    this.stacks = [stack];

    try {
      this.program.words.map((word: Word) => word.fn.call(this, this.stack));
    } catch (err) {      
      // push an error on the stack
      console.log('interpretation: err', err);
      throw err;
    }

    return this.stack.peek();
  }
}
