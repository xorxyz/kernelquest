import { Dictionary, Word } from "./compiler";
import { Execution } from "./interpreter";

export const operators: Dictionary = {
  '+': new Word('+', add),
  '-': new Word('-', sub),
  '*': new Word('*', mul),
  '/': new Word('/', div),
}

export const combinators: Dictionary = {
  'dup': new Word('dup', dup),
  'zap': new Word('zap', zap)
}

export const StandardLibrary = {
  ...operators,
  ...combinators
}

function dup (this: Execution) {
  const a = this.stack.pop();
  if (!a) throw new Error('missing operand');
  this.stack.push(a);
  this.stack.push(a);
}

function zap (this: Execution) {
  const a = this.stack.pop();
  if (!a) throw new Error('missing operand');
}

function add (this: Execution) {
  const b = this.stack.pop();
  if (typeof b === 'undefined') throw new Error('missing operand');
  if (typeof b !== 'number') throw new Error('wrong input type');

  const a = this.stack.pop();
  if (typeof a === 'undefined') throw new Error('missing operand');
  if (typeof a !== 'number') throw new Error('wrong input type');

  const result = a + b;

  this.stack.push(result);
}

function sub (this: Execution) {
  const b = this.stack.pop();
  if (typeof b === 'undefined') throw new Error('missing operand');
  if (typeof b !== 'number') throw new Error('wrong input type');

  const a = this.stack.pop();
  if (typeof a === 'undefined') throw new Error('missing operand');
  if (typeof a !== 'number') throw new Error('wrong input type');

  const result = a - b;

  this.stack.push(result);
}

function mul (this: Execution) {
  const b = this.stack.pop();
  if (typeof b === 'undefined') throw new Error('missing operand');
  if (typeof b !== 'number') throw new Error('wrong input type');

  const a = this.stack.pop();
  if (typeof a === 'undefined') throw new Error('missing operand');
  if (typeof a !== 'number') throw new Error('wrong input type');

  const result = a * b;

  this.stack.push(result);
}

function div (this: Execution) {
  const b = this.stack.pop();
  if (typeof b === 'undefined') throw new Error('missing operand');
  if (typeof b !== 'number') throw new Error('wrong input type');

  const a = this.stack.pop();
  if (typeof a === 'undefined') throw new Error('missing operand');
  if (typeof a !== 'number') throw new Error('wrong input type');

  const result = a / b;

  this.stack.push(result);
}
