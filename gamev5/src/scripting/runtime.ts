import { Compiler } from './compiler';
import { Dictionary } from './dictionary';
import { RuntimeExecution, Interpreter } from './interpreter';
import { Stack } from './stack';

export class Runtime {
  private compiler: Compiler;

  private dictionary = new Dictionary();

  private interpreter: Interpreter;

  private stack = new Stack();

  constructor() {
    this.compiler = new Compiler(this.dictionary);
    this.interpreter = new Interpreter(this.dictionary);
  }

  get done(): boolean {
    return this.interpreter.done;
  }

  execute(code: string): RuntimeExecution {
    const expression = this.compiler.compile(code);
    const execution = this.interpreter.evaluate(this.stack, expression);

    return execution;
  }
}
