/* eslint-disable no-underscore-dangle */
import { IAction } from '../engine';
import { Stack } from '../shared';
import { Dictionary } from './compiler';
import { Database } from './database';
import { Quotation } from './literals';

export interface ExecuteArgs {
  stack: Stack<Factor>
  syscall: (action: IAction) => void
  exec: (term: Term, callback?: () => void) => void
  dict: Dictionary
  db: Database
}

export abstract class Factor {
  type: string;
  lexeme: string;
  value?: unknown;
  constructor(lexeme: string) {
    this.lexeme = lexeme;
  }

  abstract dup()

  abstract validate(stack: Stack<Factor>)
  abstract execute(args: ExecuteArgs)
  abstract toString (): string
}

export abstract class Literal extends Factor {
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
export class Term extends Array<Factor> {
  toString() {
    return this.map((f) => f.toString()).join(' ');
  }
}
