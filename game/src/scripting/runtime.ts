import { IAction } from '../shared/interfaces';
import { Compiler } from './compiler';
import { Dictionary } from './dictionary';
import { RuntimeExecution, Interpreter } from './interpreter';
import { Stack } from './stack';

export class Runtime {
  private compiler: Compiler;

  private dictionary = new Dictionary();

  private interpreter: Interpreter;

  private stack = new Stack();

  private execution: RuntimeExecution | null = null;

  constructor(dictionaries?: Dictionary[]) {
    if (dictionaries) {
      dictionaries.forEach((dict) => { this.dictionary.combine(dict); });
    }
    this.compiler = new Compiler(this.dictionary);
    this.interpreter = new Interpreter(this.dictionary);
  }

  done(): boolean {
    return !this.execution;
  }

  clear(): void {
    this.stack.clear();
  }

  execute(code: string): RuntimeExecution {
    const expression = this.compiler.compile(code);
    const execution = this.interpreter.evaluate(this.stack, expression);

    this.execution = execution;

    return execution;
  }

  continue(): IAction | null {
    if (!this.execution) return null;
    const result = this.execution.next();
    if (result.done) {
      this.execution = null;
    }
    return result.value;
  }

  printStack(): string {
    return this.interpreter.printStack();
  }

  printExpression(): string {
    return this.interpreter.printExpression();
  }
}
