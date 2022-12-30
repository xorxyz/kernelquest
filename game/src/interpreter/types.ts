/* eslint-disable no-underscore-dangle */
import { IAction } from '../engine';
import { Stack } from '../shared';

export interface ExecuteArgs {
  stack: Stack<Factor>
  syscall: (action: IAction) => void
  exec: (term: Term, callback?: () => void) => void
}

export abstract class Factor {
  type: string;
  lexeme: string;
  value?: unknown;
  constructor(lexeme: string) {
    this.lexeme = lexeme;
  }

  abstract validate(stack: Stack<Factor>)
  abstract execute(args: ExecuteArgs)
  abstract toString (): string
}

export class Literal extends Factor {
  value: unknown;

  constructor(lexeme: string, value?: unknown) {
    super(lexeme);

    this.value = value;
  }

  toString() {
    return `${String(this.value)}`;
  }

  validate() {
    return true;
  }

  execute({ stack }) {
    stack.push(this);
  }
}

// https://en.wikipedia.org/wiki/Term_logic#Term
export type Term = Array<Factor>;

export type List = Array<Literal>;
