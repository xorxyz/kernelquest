import { Stack } from "../../lib/stack";
import { StandardLibrary } from "./stdlib";
import { Compiler, Word } from './compiler';

export interface IProgram {
  words: Array<Word>
}

export class Execution {
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

    this.program.words.map((word: Word) => word.fn.call(this, this.stack));

    return this.stack.peek();
  }
}

export class Interpreter {
  stack: Stack<Word> = new Stack()
  compiler = new Compiler(StandardLibrary)

  async interpret (line: string) {  
    try {
      const program = this.compiler.compile(line);
      console.log(program);

      const execution = new Execution(program);
  
      execution.start(this.stack);
    } catch (err: any) {
      console.error(err.message);
    }
  }
}
