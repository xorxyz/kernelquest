import { Factor, Literal } from './types';
import { LiteralString, Quotation } from './literals';
import { choice, Operator } from './operators';

export class Combinator extends Operator {}

export const concat = new Combinator(['concat'], ['string|quotation', 'string|quotation'], ({ stack, syscall }) => {
  const b = stack.pop() as Factor;
  const a = stack.pop() as Factor;

  if (a instanceof LiteralString && b instanceof LiteralString) {
    stack.push(new LiteralString(a.value.concat(b.value)));
    return;
  }

  if (a instanceof Quotation && b instanceof Quotation) {
    stack.push(new Quotation(a.value.concat(b.value)));
    return;
  }

  stack.push(a);
  stack.push(b);

  syscall({
    name: 'puts',
    args: {
      message: 'concat: args should be two strings or two quotations',
    },
  });
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

  exec([
    new Quotation(),
    ...list.value.flatMap((f) => [
      f,
      ...program.value,
      new Quotation(),
      cons,
      concat,
    ]),
  ]);
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
