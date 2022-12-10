import { debug } from '../shared';
import { Interpretation } from './interpreter';
import { Factor, Literal } from './types';
import { LiteralNumber, Quotation } from './literals';
import { Operator } from './operators';

export class Combinator extends Operator {}

export const concat = new Combinator(['concat'], ['quotation', 'quotation'], ({ stack }) => {
  const a = stack.pop() as Quotation;
  const b = stack.pop() as Quotation;

  stack.push(new Quotation(b.value.concat(a.value)));
});

// [b] [a] -> [[b] a]
export const cons = new Combinator(['cons'], ['any', 'quotation'], ({ stack }) => {
  const b = stack.pop() as Quotation;
  const a = stack.pop() as Literal;

  const next = new Quotation();

  console.log(a);
  console.log(b);

  next.add(a);
  b.value.forEach((factor) => {
    debug('factor', factor);
    next.add(factor);
  });

  stack.push(next);
});

// a -> [a]
export const unit = new Combinator(['unit'], ['any'], ({ stack }) => {
  const a = stack.pop() as Factor;
  const next = new Quotation();

  next.add(a);
  stack.push(next);
});

export const i = new Combinator(['i', 'exec'], ['quotation'], ({ stack, agent }) => {
  const program = stack.pop() as Quotation;

  const interpretation = new Interpretation(program.value);

  try {
    interpretation.run({ stack, agent });
  } catch (err) {
    stack.push(program);
    throw err;
  }
});

// [B] [A] -> A [B]
export const dip = new Combinator(['dip'], ['quotation', 'quotation'], ({ stack, agent }) => {
  const a = stack.pop() as Quotation;
  const b = stack.pop() as Quotation;

  const interpretation = new Interpretation(a.value);

  try {
    interpretation.run({ stack, agent });
    stack.push(b);
  } catch (err) {
    stack.push(a);
    stack.push(b);
    throw err;
  }
});

export const map = new Combinator(['map'], ['quotation', 'quotation'], ({ stack, agent }) => {
  const program = stack.pop() as Quotation;
  const list = stack.pop() as Quotation;

  const interpretation = new Interpretation(program.value);
  const results = new Quotation();

  list.value.forEach((factor) => {
    stack.push(factor);
    interpretation.run({ stack, agent });
    const result = stack.pop();
    if (result) {
      results.add(result);
    }
  });

  stack.push(results);
});

// [C] [B] [A] -> B || A
export const ifte = new Combinator(['ifte'], ['quotation', 'quotation', 'quotation'], ({ stack, agent }) => {
  const a = stack.pop() as Quotation;
  const b = stack.pop() as Quotation;
  const c = stack.pop() as Quotation;

  const test = new Interpretation(c.value);
  test.run({ stack, agent });
  const tested = stack.pop();

  const term = tested && tested.value
    ? b.value
    : a.value;

  const interpretation = new Interpretation(term);
  interpretation.run({ stack, agent });
});

const combinators = {};

[
  concat, cons, unit,
  i, dip,
  map, ifte,
].forEach((combinator) => {
  combinator.aliases.forEach((alias) => {
    combinators[alias] = combinator;
  });
});

export default combinators;
