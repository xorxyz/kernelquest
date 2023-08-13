import { Compiler } from './compiler';
import { Dictionary } from './dictionary';
import { Expression } from './expression';

export class Interpreter {
  private dictionary: Dictionary;

  private expression: Expression | null = null;

  constructor(dictionary: Dictionary) {
    this.dictionary = dictionary;
  }

  read(text: string): void {
    const compiler = new Compiler(this.dictionary, text);
    this.expression = compiler.compile();
  }

  step(): void {
    if (!this.expression) {
      // Handle case when there is no active expression
    }
  }
}
