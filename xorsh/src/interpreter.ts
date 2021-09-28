import { Stack } from "../../lib/stack";
import { StandardLibrary } from "./stdlib";
import { Thing } from "./world";
import { Compiler, Word } from './compiler';

type DataStack = Stack<Thing>

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

  get stack(): DataStack {
    return this.stacks[this.level];
  }

  set stack(s) {
    this.stacks[this.level] = s;
  }

  start(stack: DataStack) {
    this.stacks = [stack];

    this.program.words.map((word: Word) => word.fn.call(this, this.stack));

    return this.stack.peek();
  }
}

export class Interpreter {
  stack: Stack<Thing> = new Stack()
  compiler = new Compiler(StandardLibrary)

  async interpret (line: string) {
    await new Promise((done) => setTimeout(done, 200));
  
    try {
      const program = this.compiler.compile(line);
      const execution = new Execution(program);
  
      execution.start(this.stack)
  
      console.log(execution.stack);
    } catch (err) {
      console.log(err.message)
    }
  }
}
