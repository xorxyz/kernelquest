/* eslint-disable no-underscore-dangle */
import { IAction } from '../engine';
import { Stack } from '../shared';

export type Continuation = (done: () => void) => void

export type InterpretFn = (term: Term, continuation?: ExecuteFn) => void

export type SyscallFn = (action: IAction, continuation?: ExecuteFn) => void

export type ExecuteFactorFn = () => void

export interface Interpretation {
  stack: Stack<Factor>
  term: Term
  continuation?: ExecuteFn
}

export interface ExecuteArgs extends Interpretation {
  exec: InterpretFn
  syscall: SyscallFn
}

export type ExecuteFn = () => void

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
