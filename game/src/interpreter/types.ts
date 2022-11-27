/* eslint-disable no-underscore-dangle */
import { Vector, Queue, Stack } from '../shared';
import { Dictionary } from './compiler';

// https://en.wikipedia.org/wiki/Term_logic#Term

export interface IExecutionAgent {
  cursorPosition: Vector
}

export interface IExecutionArguments {
  stack: Stack<Factor>,
  queue?: Queue<any>,
  dict?: Dictionary,
  agent: IExecutionAgent
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
