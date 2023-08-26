import { Interpreter } from './interpreter';
import { Stack } from './stack';
import { Dictionary } from './dictionary';
import { Compiler } from './compiler';
import { IAction } from '../shared/interfaces';

export class VM {
  private dictionary = new Dictionary();

  private compiler = new Compiler(this.dictionary);

  private interpreter = new Interpreter(this.dictionary);

  exec(stack: Stack, code: string): IAction | null {
    const expression = this.compiler.compile(code);

    return this.interpreter.evaluate(stack, expression);
  }
}
