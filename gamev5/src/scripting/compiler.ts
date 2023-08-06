import { Dictionary } from './dictionary';
import { Expression } from './expression';
import { Lexer } from './lexer';

export class Compiler {
  private lexer = new Lexer();

  private dictionary: Dictionary;

  constructor(dictionary: Dictionary) {
    this.dictionary = dictionary;
  }

  compile(text: string): Expression {
    const code = text.split('\n');
    const expression = new Expression(code, []);

    return expression;
  }
}
