import { Compiler } from './compiler';
import { Dictionary } from './dictionary';
import { Expression } from './expression';

export class Interpreter {
  private compiler: Compiler;

  private expression: Expression | null = null;

  constructor(dictionary: Dictionary) {
    this.compiler = new Compiler(dictionary);
  }

  read(text: string): void {
    this.expression = this.compiler.compile(text);
  }

  step(): void {
    if (!this.expression) {
      // Handle case when there is no active expression
    }
  }
}
