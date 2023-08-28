import { Interpreter } from '../../../scripting/interpreter';
import { Stack } from '../../../scripting/stack';
import { Dictionary } from '../../../scripting/dictionary';
import { Compiler } from '../../../scripting/compiler';
import { IAction } from '../../../shared/interfaces';

export class VM {
  readonly stack = new Stack();

  private dictionary = new Dictionary();

  private compiler = new Compiler(this.dictionary);

  private interpreter = new Interpreter(this.dictionary);

  eval(code: string): IAction | null {
    const expression = this.compiler.compile(code);

    this.interpreter.evaluate(this.stack, expression);

    const action = this.interpreter.step();

    return action;
  }
}
