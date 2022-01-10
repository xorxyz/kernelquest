import { debug } from 'xor4-lib/utils';
import { Interpretation } from '.';
import { Factor } from './types';
import { LiteralNumber, LiteralRef, Quotation } from './literals';
import { Operator } from './operators';

export class Combinator extends Operator {}

export const concat = new Combinator(['concat'], ['quotation', 'quotation'], (stack) => {
  const a = stack.pop() as Quotation;
  const b = stack.pop() as Quotation;

  stack.push(new Quotation(b.value.concat(a.value)));
});

// [b] [a] -> [[b] a]
export const cons = new Combinator(['cons'], ['quotation', 'quotation'], (stack) => {
  const a = stack.pop() as Quotation;
  const b = stack.pop() as Quotation;

  const next = new Quotation();

  next.add(b);
  a.value.forEach((factor) => {
    debug('factor', factor);
    next.add(factor);
  });

  stack.push(next);
});

// a -> [a]
export const unit = new Combinator(['unit'], ['any'], (stack) => {
  const a = stack.pop() as Factor;
  const next = new Quotation();

  next.add(a);
  stack.push(next);
});

export const i = new Combinator(['i', 'exec'], ['quotation'], (stack) => {
  const program = stack.pop() as Quotation;

  const interpretation = new Interpretation(program.value);

  try {
    interpretation.run(stack);
  } catch (err) {
    stack.push(program);
    throw err;
  }
});

// [B] [A] -> A [B]
export const dip = new Combinator(['dip'], ['quotation', 'quotation'], (stack) => {
  const a = stack.pop() as Quotation;
  const b = stack.pop() as Quotation;

  const interpretation = new Interpretation(a.value);

  try {
    interpretation.run(stack);
    stack.push(b);
  } catch (err) {
    stack.push(a);
    stack.push(b);
    throw err;
  }
});

export const map = new Combinator(['map'], ['quotation', 'quotation'], (stack) => {
  const program = stack.pop() as Quotation;
  const list = stack.pop() as Quotation;

  const interpretation = new Interpretation(program.value);
  const results = new Quotation();

  list.value.forEach((factor) => {
    stack.push(factor);
    interpretation.run(stack);
    const result = stack.pop();
    if (result) {
      results.add(result);
    }
  });

  stack.push(results);
});

// [C] [B] [A] -> B || A
export const ifte = new Combinator(['ifte'], ['quotation', 'quotation', 'quotation'], (stack) => {
  const a = stack.pop() as Quotation;
  const b = stack.pop() as Quotation;
  const c = stack.pop() as Quotation;

  const test = new Interpretation(c.value);
  test.run(stack);
  const tested = stack.pop();

  const term = tested && tested.value
    ? b.value
    : a.value;

  const interpretation = new Interpretation(term);
  interpretation.run(stack);
});

export const ref = new Operator(['ref'], ['number', 'number'], (stack) => {
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;
  stack.push(new LiteralRef(x.value, y.value));
});

export const struct = new Operator(['struct'], ['ref', 'number', 'number'], (stack) => {
  stack.pop() as LiteralNumber;
  stack.pop() as LiteralNumber;
  const c = stack.pop() as LiteralRef;

  stack.push(new LiteralRef(c.vector.x, c.vector.y));
});

export const route = new Operator(['route'], ['ref', 'ref'], (stack) => {
  stack.pop() as LiteralRef;
  const b = stack.pop() as LiteralRef;
  stack.push(new LiteralRef(b.vector.x, b.vector.y));
});

const combinators = {};

[
  concat, cons, unit,
  i, dip,
  map, ifte,
  ref, struct, route,
].forEach((combinator) => {
  combinator.aliases.forEach((alias) => {
    combinators[alias] = combinator;
  });
});

export default combinators;
