import { Stack } from '../lib/stack';
import { Compiler } from './compiler';
import { Scanner, Token } from './scanner';
import { Parser } from './parser';

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

export class Operator extends Combinator {
  toJSON() { return this.type; }
}

export class List extends Array {}
export class RuntimeError extends List {
  static from(args: Array<string>) {
    const err = new RuntimeError();

    args.forEach((arg) => err.push(arg));

    return err;
  }
}

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
  /* -- Reserved characters -- */
  /** returns whats on top of the stack */
  period() {
    debug('period.');
    const result = this.stack.peek();
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
  true() {
    this.stack.push(true);
    return this;
  }

  /** pushes false */
  false() {
    this.stack.push(false);
    return this;
  }

  /** pushes a number */
  number(num: number) {
    this.stack.push(num);
    return this;
  }

  /** pushes a character */
  char(str: string) {
    this.stack.push(str);
    return this;
  }

  /** pushes a string */
  string(str: string) {
    this.stack.push(str);
    return this;
  }

  /* -- Operators -- */
  $op(name: string, cb: Function) {
    const op = new Operator(name, cb);

    if (this.level === 0) {
      op.exec();
    } else {
      this.stack.push(op);
    }

    return this;
  }

  clear() {
    this.stack.clear();
    return this;
  }

  pop() {
    return this.$op('pop', () => {
      const item = this.stack.pop();
      debug('pop', item, `(${this.stack.join(',')})`);

      log(item);
    });
  }

  /** x y -> x + y */
  add() {
    return this.$op('add', () => {
      const b = this.stack.pop();
      const a = this.stack.pop() || '';
      if (typeof b !== 'number' || typeof a !== 'number') {
        this.stack.push(RuntimeError.from(['err', 'add expects 2 numbers']));
      } else {
        this.stack.push(a + b);
      }
    });
  }

  mul() {
    return this.$op('mul', () => {
      const b = this.stack.pop();
      const a = this.stack.pop();

      if (typeof b !== 'number' || typeof a !== 'number') {
        this.stack.push(RuntimeError.from(['err', 'mul expects 2 numbers']));
      } else {
        this.stack.push(a * b);
      }
    });
  }

  div() {
    return this.$op('div', () => {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (typeof b !== 'number' || typeof a !== 'number') {
        this.stack.push(RuntimeError.from(['err', 'div expects 2 numbers']));
      } else {
        this.stack.push(a / b);
      }
    });
  }

  dup() {
    return this.$op('dup', () => {
      const a = this.stack.pop();
      this.stack.push(a);
      this.stack.push(a);
    });
  }

  dip() {
    return this.$op('dip', () => {
      const b = this.stack.pop();
      const a = this.stack.pop();
      if (!(b instanceof List || typeof a === 'undefined')) {
        this.stack.push(RuntimeError.from(['err', 'dip expects a value and a program.']));
      } else {
        this.stack.push(b);
        this.i();
        this.stack.push(a);
      }
    });
  }

  concat() {
    return this.$op('concat', () => {
      const b = this.stack.pop();
      const a = this.stack.pop();
      const result = a.concat(b);
      this.stack.push(result);
    });
  }

  cons() {
    return this.$op('cons', () => {
      const b = this.stack.pop();
      const a = this.stack.pop();

      debug(a, b);
      if (a instanceof List && b instanceof List) {
        const result = List.from([a, ...b]);
        this.stack.push(result);
      } else {
        this.stack.push(RuntimeError.from(['err:', 'cons expects two lists']));
      }
    });
  }

  swap() {
    return this.$op('swap', () => {
      const b = this.stack.pop();
      const a = this.stack.pop();

      debug(a, b);
      if (typeof a !== 'undefined' && typeof b !== 'undefined') {
        this.stack.push(b);
        this.stack.push(a);
      } else {
        this.stack.push(RuntimeError.from(['err:', 'swap expects 2 items']));
      }
    });
  }

  /** [1 2] [1 add] map -> [2 3] */
  /** [1 2] [add] map -> [3] */
  map() {
    return this.$op('map', () => {
      const program = this.stack.pop();
      const list = this.stack.pop();
      const result = new List();

      list.forEach((item) => {
        const l = List.from([item, ...program]);
        this.stack.push(l);
        this.i();
        const r = this.stack.pop();
        result.push(r);
      });

      this.stack.push(result);
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
        this.stack.push(word);
      }
    });

    return this;
  }
}

export class VM extends Quotation {
  eval(js: string) {
    // eslint-disable-next-line no-new-func
    const apply = new Function('begin', `
      'use strict'; 
      return (${js})
    `);

    const result = apply(this);

    return result;
  }
}

export default class Intrepreter {
  source: string
  stack: Stack<any>
  tokens: Array<Token>

  get $DEBUG() { return DEBUG; }
  set $DEBUG(value) { DEBUG = value; }

  constructor(stack: Stack<any> = new Stack()) {
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

    try {
      this.check(str);
    } catch (err) {
      console.error('check err:', err);
      return RuntimeError.from([err.name, err.message]);
    }

    const compiler = new Compiler(this.tokens);
    this.source = compiler.compile();

    debug(this.source);

    const vm = new VM(this.stack);

    try {
      vm.eval(this.source);
    } catch (err) {
      console.error('eval err:', err);
      if (err.name === 'TypeError') {
        return RuntimeError.from(['err:', 'unknown word']);
      }
      return RuntimeError.from([err.name, err.message]);
    }

    debug(vm);

    return this.stack.peek();
  }
}
