import { IAction } from '../shared/interfaces';
import { Atom } from './atom';
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

  private output: Array<string> = []

  private debug = false;

  constructor(dictionaries?: Dictionary[]) {
    if (dictionaries) {
      dictionaries.forEach((dict) => { this.dictionary.combine(dict); });
    }
    this.compiler = new Compiler(this.dictionary);
    this.interpreter = new Interpreter(this.dictionary);
  }

  isDebugEnabled () {
    return this.debug;
  }

  done(): boolean {
    return !this.execution;
  }

  clear(): void {
    this.output.splice(0, this.output.length);
    // this.stack.clear();
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

  print(text: string) {
    this.output.push(text);
  }

  getOutput() {
    return [...this.output];
  }

  printStack(): string {
    return this.interpreter.printStack();
  }

  printExpression(): string {
    return this.interpreter.printExpression();
  }

  enableDebug () {
    this.debug = true;
  }

  disableDebug () {
    this.debug = true;
  }

  pop(): Atom | undefined {
    return this.stack.pop();
  }

  push(atom: Atom) {
    this.stack.push(atom);
  }
}
