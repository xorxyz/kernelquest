import { debug } from '../shared';
import { Factor, Literal, Term } from './types';
import { LiteralTruth, Quotation } from './literals';
import { choice, Operator, swap } from './operators';
import { runSeries } from '../shared/async';

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

  b.add(a);

  stack.push(b);
});

// a -> [a]
export const unit = new Combinator(['unit'], ['any'], ({ stack }) => {
  const a = stack.pop() as Factor;
  const next = new Quotation();

  next.add(a);
  stack.push(next);
});

export const i = new Combinator(['i'], ['quotation'], ({ stack, exec }) => {
  const program = stack.pop() as Quotation;

  exec(program.value);
});

export const map = new Combinator(['map'], ['quotation', 'quotation'], ({ stack, exec }) => {
  const program = stack.pop() as Quotation;
  const list = stack.pop() as Quotation;

  const p: Term = [];

  p.push(new Quotation());
  list.value.forEach((f) => {
    p.push(f);
    program.value.forEach((v) => p.push(v));
    p.push(swap);
    p.push(cons);
  });

  exec(p);
});

export const filter = new Combinator(['filter'], ['quotation', 'quotation'], ({ stack, exec }) => {
  const program = stack.pop() as Quotation;
  const list = stack.pop() as Quotation;

  exec([
    new Quotation(),
    ...list.value.flatMap((item) => [
      new Quotation([
        item,
        ...program.value,
      ]),
      new Quotation([new Quotation([item])]),
      new Quotation([new Quotation()]),
      ifte,
      concat,
    ]),
  ]);
});

// [C] [B] [A] -> B || A
export const ifte = new Combinator(['ifte'], ['quotation', 'quotation', 'quotation'], ({ stack, exec }) => {
  const rightOption = stack.pop() as Quotation;
  const leftOption = stack.pop() as Quotation;
  const test = stack.pop() as Quotation;

  exec([
    test,
    i,
    leftOption,
    rightOption,
    choice,
    i,
  ]);
});

const combinators = {};

[
  concat, cons, unit,
  i,
  map, filter, ifte,
].forEach((combinator) => {
  combinator.aliases.forEach((alias) => {
    combinators[alias] = combinator;
  });
});

export default combinators;
