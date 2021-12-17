import { Stack } from "../../../lib/stack";
import { Token } from "./lexer";

export abstract class Factor {
  lexeme: string
  value?: any;
  constructor (lexeme: string) {
    this.lexeme = lexeme
  }

  abstract validate(stack: Stack<Factor>)
  abstract execute(stack: Stack<Factor>)
  _validate (stack: Stack<Factor>) {
    this.validate(stack);
  }
  _execute (stack: Stack<Factor>) {
    this.execute(stack);
  }
}

export class Literal extends Factor {
  value: any
  type: string

  constructor (lexeme: string, value?: any) {
    super(lexeme);

    this.value = value;
  }

  validate() {
    return true;
  }

  execute(stack: Stack<Factor>) {
    stack.push(this);
  }
}

export type Term = Array<Factor>;

export type List = Array<Literal>;

export type Dictionary = Record<string, Factor>

export interface IProgram {
  tokens: Array<Token>
  term: Array<Factor>
}

export type StackFn = (stack: Stack<Factor>) => void;
