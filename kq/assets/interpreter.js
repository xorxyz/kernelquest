// xor shell v0.1
// copyright (c) 2019, 2020, 2021 Jonathan Dupré <jonathan@diagonal.sh>

import { Compiler } from './compiler.js';
import { Scanner } from './scanner.js';
import { Parser } from './parser.js';

let DEBUG = 0;
const log = (...msg) => (console.log(...msg));
const debug = (...msg) => (DEBUG ? log(...msg) : 0);
export class Combinator {
  constructor(op, fn) {
    this.type = op;
    this.fn = fn;
    Object.defineProperty(this, 'fn', {
      enumerable: false,
    });
  }
  exec() {
    debug(this.type);
    this.fn();
  }
  toString() { return this.type; }
  valueOf() { return this.type; }
}
export class Operator extends Combinator {
}
export class List extends Array {
}
export class RuntimeError extends List {
}
export class Stack extends List {
  peek() { return this[this.length - 1]; }
}
export class Factor {
  constructor(stack = new Stack()) {
    this.level = 0;
    this.stacks = [stack];
    Object.defineProperty(this, 'stacks', {
      enumerable: false,
    });
  }
  get stack() { return this.stacks[this.level]; }
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
}
export class Quotation extends Factor {
  period() {
    debug('period.');
    const result = this.peek();
    return result;
  }
  eof() { this.period(); }
  lparen() {
    this.level--;
    this.stack = new Stack();
    debug('level:', this.level, `(${this.stack.join(',')})`);
    return this;
  }
  rparen() {
    const { stack } = this;
    delete this.stacks[this.level];
    this.level++;
    if (stack) {
      this.stack.push(List.from(stack));
      debug('level:', this.level, `(${this.stack.join(',')})`);
    }
    return this;
  }
  lbrace() {
    this.level--;
    this.stack = new Stack();
    debug('level:', this.level, `(${this.stack.join(',')})`);
    return this;
  }
  rbrace() {
    this.level++;
    const { stack } = this;
    delete this.stacks[this.level];
    this.level++;
    if (stack) {
      this.stack.push(new Set(...stack));
      debug('level:', this.level, `(${this.stack.join(',')})`);
    }
    return this;
  }
  true() { return this.push(true); }
  false() { return this.push(false); }
  number(num) { return this.push(num); }
  char(str) { return this.push(str); }
  string(str) { return this.push(str); }
  add() {
    const op = new Operator('add', () => {
      const b = this.pop();
      const a = this.pop() || '';
      this.push(a + b);
    });
    if (this.level === 0) {
      op.exec();
    } else {
      this.push(op);
    }
    return this;
  }
  i() {
    debug('exec');
    const list = this.pop();
    if (!(list instanceof List)) {
      throw new Error('exec expects a list');
    }
    debug(list);
    list.forEach((word) => {
      if (word instanceof Operator) {
        word.exec();
      } else {
        this.push(word);
      }
    });
    return this;
  }
}
export class VM extends Quotation {
  eval(js) {
    const apply = new Function('begin', `'use strict';return (${js})`);
    const result = apply(this);
    return result;
  }
}
export default class Intrepreter {
  constructor(stack = new Stack()) {
    this.stack = stack;
  }
  get $DEBUG() { return DEBUG; }
  set $DEBUG(value) { DEBUG = value; }
  check(str) {
    const scanner = new Scanner(str);
    const tokens = scanner.scan();
    debug(tokens);
    const parser = new Parser(tokens);
    parser.parse();
    this.tokens = tokens;
  }
  exec(str) {
    debug(str);
    this.check(str);
    const compiler = new Compiler(this.tokens);
    this.source = compiler.compile();
    debug(this.source);
    const vm = new VM(this.stack);
    try {
      vm.eval(this.source);
    } catch (err) {
      return RuntimeError.from([err.name, err.message]);
    }
    debug(vm);
    return this.stack.peek();
  }
}
