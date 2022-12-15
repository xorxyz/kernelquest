/* eslint-disable no-underscore-dangle */
import { IAction } from '../engine';
import { Stack } from '../shared';
import { Dictionary } from './compiler';
import { Quotation } from './literals';

// https://en.wikipedia.org/wiki/Term_logic#Term

export interface IExecutionArguments {
  stack: Stack<Factor>,
  dict: Dictionary,
  syscall: (action: IAction, callback?: (done: () => void) => void) => void
  exec: (text: string, callback?: (done: () => void) => void) => void
}

export type ExecuteFn = (args: IExecutionArguments) => void

export abstract class Factor {
  type: string;
  lexeme: string;
  value?: any;
  constructor(lexeme: string) {
    this.lexeme = lexeme;
  }

  abstract validate(stack: Stack<Factor>)
  abstract execute(args: IExecutionArguments)
  abstract toString (): string
  _validate(stack: Stack<Factor>) {
    this.validate(stack);
  }
  _execute(args: IExecutionArguments) {
    this.execute(args);
  }
}

export class Literal extends Factor {
  value: any;

  constructor(lexeme: string, value?: any) {
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

export type Term = Array<Factor>;

export type List = Array<Literal>;
