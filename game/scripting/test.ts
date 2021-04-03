/* eslint-disable no-param-reassign */
/* eslint-disable indent */
/* eslint-disable newline-per-chained-call */
/* eslint-disable no-whitespace-before-property */

import * as assert from 'assert';
import test from '../lib/test';
import { Scanner } from './scanner';

const DEBUG = 1;
const log = (...msg) => (console.log(...msg));
const debug = (...msg) => (DEBUG ? log(...msg) : 0);

type Paren = '[' | ']'
type ProgramResult = any

class List extends Array {}
class Stack extends Array { peek() { return this[this.length - 1]; }}
class Term {
  stacks: Array<any> = [new Stack()]
  level = 0

  get stack() {
    return this.stacks[this.level];
  }

  set stack(s) {
    this.stacks[this.level] = s;
  }

  peek() {
    debug('peek', 'level:', this.level);
    debug('stack', this.stack);
    return this.stack.peek();
  }

  pop() {
    const item = this.stack.pop();
    debug('pop', item, `(${this.stack.join(',')})`);

    return item;
  }

  push(item) {
    this.stack.push(item);
    debug('push', item, `(${this.stack.join(',')})`);

    return this;
  }

  /** opens or closes a quotation */
  p(paren: Paren) {
    if (paren === '[') return this['[']();
    if (paren === ']') return this[']']();
    throw new Error('invalid value for paren');
  }

  ['[']() {
    this.level++;
    this.stack = new Stack();
    debug('level:', this.level, `(${this.stack.join(',')})`);
    return this;
  }

  [']']() {
    const { stack } = this;
    delete this.stacks[this.level];
    this.level--;
    if (stack) {
      this.stack.push(List.from(stack));
      debug('level:', this.level, `(${this.stack.join(',')})`);
    }
    return this;
  }
}

export class Program extends Term {
  constructor(stack?: Stack) {
    super();
    if (stack) {
      this.stacks[0] = stack;
    }
  }

  /* Literals */
  /** pushes true */
  t() { return this.push(true); }
  /** pushes false */
  f() { return this.push(false); }
  /** pushes a number */
  n(num: number) { return this.push(num); }
  /** pushes a character */
  c(str: string) { return this.push(str); }
  /** pushes a string */
  str(str: string) { return this.push(str); }

  /* Operators */
  /** x y -> x + y */
  add() {
    debug('add');
    const b = this.pop();
    const a = this.pop();

    this.push(a + b);

    return this;
  }

  /* Combinators */
  /** execute the program sitting on top of the stack */
  exec() {
    debug('exec');
    const list = this.pop();

    list.forEach((word) => {
      this.push(word);
    });

    return this;
  }

  /** returns whats on top of the stack */
  get bye(): ProgramResult {
    debug(this);
    const result = this.peek();
    debug('bye');
    debug(result);
    return result;
  }
}

test(() => {
  // const hi = new Program();
  // const result = hi
  //   . p('[') . n(1) .n(2) . add() . p(']') . exec()
  //   . bye;

  // assert.strictEqual(result, 3, 'exec() executes binary programs.');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const hi2 = new Program();
  const str = '[ 1 2 + ] exec';
  const scanner = new Scanner(str);
  const tokens = scanner.scan();
  console.log(tokens);

  // eslint-disable-next-line no-eval
  // eval(str);
});
