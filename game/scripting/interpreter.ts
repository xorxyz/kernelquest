// eslint-disable-next-line import/no-unresolved
import { Compiler } from './compiler.js';
// eslint-disable-next-line import/no-unresolved
import { Scanner, Token } from './scanner.js';
// eslint-disable-next-line import/no-unresolved
import { Parser } from './parser.js';

let DEBUG = 1;

const log = (...msg) => (console.log(...msg));
const debug = (...msg) => (DEBUG ? log(...msg) : 0);

export class Combinator {
  type: string
  private fn: Function

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

export class Operator extends Combinator {}

export class List extends Array {}
export class RuntimeError extends List {}
export class Stack extends List { peek() { return this[this.length - 1]; }}

export class Factor {
  level = 0
  stacks: Array<any>

  constructor(stack = new Stack()) {
    this.stacks = [stack];
    Object.defineProperty(this, 'stacks', {
      enumerable: false,
    });
  }

  get stack() { return this.stacks[this.level]; }
  set stack(s) {
    this.stacks[this.level] = s;
  }
}

export class Quotation extends Factor {
  peek() {
    debug('peek', 'level:', this.level);
    debug('stack', this.stack);
    return this.stack.peek();
  }

  pop() {
    const item = this.stack.pop();
    debug('pop', item, `(${this.stack.join(',')})`);

    log(item);

    return this;
  }

  push(item) {
    this.stack.push(item);
    debug('push', item, `(${this.stack.join(',')})`);

    return this;
  }

  /* -- Reserved characters -- */
  /** returns whats on top of the stack */
  period() {
    debug('period.');
    const result = this.peek();
    return result;
  }
  eof() { this.period(); }

  /** start enumerating list. go down a level */
  lparen() {
    this.level--;
    this.stack = new Stack();
    debug('level:', this.level, `(${this.stack.join(',')})`);
    return this;
  }

  /** finish enumerating list. bring list up a level */
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

  /** start enumerating set. go down a level */
  lbrace() {
    this.level--;
    this.stack = new Stack();
    debug('level:', this.level, `(${this.stack.join(',')})`);
    return this;
  }

  /** finish enumerating set. bring set up a level */
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

  /* -- Literals -- */
  /** pushes true */
  true() { return this.push(true); }

  /** pushes false */
  false() { return this.push(false); }

  /** pushes a number */
  number(num: number) { return this.push(num); }

  /** pushes a character */
  char(str: string) { return this.push(str); }

  /** pushes a string */
  string(str: string) { return this.push(str); }

  /* -- Operators -- */
  $op(name: string, cb: Function) {
    const op = new Operator(name, cb);

    if (this.level === 0) {
      op.exec();
    } else {
      this.push(op);
    }

    return this;
  }

  /** x y -> x + y */
  add() {
    return this.$op('add', () => {
      const b = this.stack.pop();
      const a = this.stack.pop() || '';
      this.push(a + b);
    });
  }

  mul() {
    return this.$op('mul', () => {
      const b = this.stack.pop();
      const a = this.stack.pop() || '';
      this.push(a * b);
    });
  }

  dup() {
    return this.$op('dup', () => {
      const a = this.stack.pop();
      this.push(a);
      this.push(a);
    });
  }

  concat() {
    return this.$op('concat', () => {
      const b = this.stack.pop();
      const a = this.stack.pop();
      const result = a.concat(b);
      this.push(result);
    });
  }

  cons() {
    return this.$op('cons', () => {
      const b = this.stack.pop() as List;
      const a = this.stack.pop() as List;
      debug(a, b);
      const result = List.from([a, ...b]);
      this.push(result);
    });
  }

  /** [1 2] [1 add] map -> [2 3] */
  map() {
    return this.$op('map', () => {
      const program = this.stack.pop();
      const list = this.stack.pop();
      const result = new List();

      list.forEach((item) => {
        const l = List.from([item, ...program]);
        this.push(l);
        this.i();
        const r = this.stack.pop();
        result.push(r);
      });

      this.push(result);
    });
  }

  /* -- Combinators -- */
  /** execute the program sitting on top of the stack */
  i() {
    debug('exec');
    const list = this.stack.pop();

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
  eval(js: string) {
    // eslint-disable-next-line no-new-func
    const apply = new Function('begin', `'use strict';return (${js})`);

    const result = apply(this);

    return result;
  }
}

export default class Intrepreter {
  source: string
  stack: Stack
  tokens: Array<Token>

  get $DEBUG() { return DEBUG; }
  set $DEBUG(value) { DEBUG = value; }

  constructor(stack: Stack = new Stack()) {
    this.stack = stack;
  }

  check(str: string) {
    const scanner = new Scanner(str);
    const tokens = scanner.scan();

    debug(tokens);

    const parser = new Parser(tokens);

    parser.parse();

    this.tokens = tokens;
  }

  exec(str: string) {
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
