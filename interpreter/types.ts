/* eslint-disable no-underscore-dangle */
import { Queue } from 'xor4-lib/queue';
import { Stack } from 'xor4-lib/stack';

// https://en.wikipedia.org/wiki/Term_logic#Term

export abstract class Factor {
  type: string;
  lexeme: string;
  value?: any;
  constructor(lexeme: string) {
    this.lexeme = lexeme;
  }

  abstract validate(stack: Stack<Factor>)
  abstract execute(stack: Stack<Factor>, queue?: Queue<any>)
  abstract toString (): string
  _validate(stack: Stack<Factor>) {
    this.validate(stack);
  }
  _execute(stack: Stack<Factor>, queue?: Queue<any>) {
    this.execute(stack, queue);
  }
}

export class Literal extends Factor {
  value: any;

  constructor(lexeme: string, value?: any) {
    super(lexeme);

    this.value = value;
  }

  toString() {
    return this.lexeme;
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
