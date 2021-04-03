import { Compiler } from './compiler';
import { Scanner } from './scanner';
import { Validator } from './validator';

const DEBUG = 0;
const log = (...msg) => (console.log(...msg));
const debug = (...msg) => (DEBUG ? log(...msg) : 0);

class Combinator {
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

class Operator extends Combinator {}

class List extends Array {}
class Stack extends List { peek() { return this[this.length - 1]; }}

class Factor {
  level = 0
  stacks: Array<any>

  constructor(stack = new Stack()) {
    this.stacks = [stack];
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
  /* -- Reserved characters -- */
  /** go down a level */
  lparen() {
    this.level--;
    this.stack = new Stack();
    debug('level:', this.level, `(${this.stack.join(',')})`);
    return this;
  }

  /** go up a level */
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
  /** x y -> x + y */
  add() {
    debug('add');
    const op = new Operator('add', () => {
      const b = this.pop();
      const a = this.pop();
      this.push(a + b);
    });

    if (this.level === 0) {
      op.exec();
    } else {
      this.push(op);
    }

    return this;
  }

  /* -- Combinators -- */
  /** execute the program sitting on top of the stack */
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

export class Program extends Quotation {
  /** returns whats on top of the stack */
  get bye() {
    debug('bye');
    const result = this.peek();
    return result;
  }
}

export default class Interpreter {
  stack: Stack
  program: Program

  constructor(stack: Stack = new Stack()) {
    this.stack = stack;
  }

  run(str: string) {
    debug(str);

    const scanner = new Scanner(str);
    const tokens = scanner.scan();

    debug(tokens);

    const validator = new Validator(tokens);

    validator.validate();

    const compiler = new Compiler(tokens);
    const js = compiler.compile();

    debug(js);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hi = new Program(this.stack);
    // eslint-disable-next-line no-eval
    const result = eval(js);

    debug(result);

    this.program = hi;

    return result;
  }
}
