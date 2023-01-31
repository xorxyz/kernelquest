import { Factor, Literal } from './types';
import {
  LiteralList, LiteralString, LiteralTruth, Quotation,
} from './literals';
import { choice, Operator } from './operators';
import { runSeries } from '../shared/async';

export class Combinator extends Operator {}

export const concat = new Combinator(['concat'], ['string|quotation', 'string|quotation'], ({ stack, syscall }) => {
  const b = stack.pop() as Factor;
  const a = stack.pop() as Factor;

  if (a instanceof LiteralString && b instanceof LiteralString) {
    stack.push(new LiteralString(a.value.concat(b.value)));
    return;
  }

  if (a instanceof Quotation && b instanceof Quotation) {
    stack.push(Quotation.from(a.value.concat(b.value)));
    return;
  }

  stack.push(a);
  stack.push(b);

  throw new Error('concat: args should be two strings or two quotations');
});

// [b] [a] -> [[b] a]
export const cons = new Combinator(['cons'], ['any', 'quotation'], ({ stack }) => {
  const b = stack.pop() as Quotation;
  const a = stack.pop() as Factor;

  b.unshift(a);

  stack.push(Quotation.from(b.value));
});

// a -> [a]
export const unit = new Combinator(['unit'], ['any'], ({ stack }) => {
  const a = stack.pop() as Factor;
  const next = new Quotation();

  next.add(a);
  stack.push(Quotation.from(next.value));
});

export const i = new Combinator(['i'], ['quotation'], ({ stack, exec }) => {
  const program = stack.pop() as Quotation;

  exec(program.value, () => {
    console.log('i: done');
  });
});

export const map = new Combinator(['map'], ['list', 'quotation'], ({ stack, exec }) => {
  const program = stack.pop() as Quotation;
  const list = stack.pop() as LiteralList;

  const results = new LiteralList([]);

  runSeries(list.value.map((item, i) => (done) => {
    const p = Quotation.from([item, ...program.value]);
    exec(p.value, () => {
      const result = stack.pop();
      if (!(result instanceof Factor)) {
        throw new Error('filter: result of mapping function should be a factor');
      }
      results.add(result);
      done();
    });
  }), () => {
    console.log('map: done!');
    stack.push(results);
  });
});

export const filter = new Combinator(['filter'], ['list', 'quotation'], ({ stack, exec }) => {
  const program = stack.pop() as Quotation;
  const list = stack.pop() as LiteralList;

  const results = new LiteralList([]);

  runSeries(list.value.map((item, i) => (done) => {
    console.log(`filter: running ${i}`);
    exec([item, ...program.value], () => {
      const result = stack.pop();
      if (!(result instanceof LiteralTruth)) {
        throw new Error('filter: result of test should be a truth value');
      }
      if (result.value === true) {
        results.add(item);
      }
      done();
    });
  }), () => {
    console.log('filter: done!');
    stack.push(results);
  });
});

export const reduce = new Combinator(['reduce'], ['list', 'quotation'], ({ stack, exec }) => {
  const program = stack.pop() as Quotation;
  const list = stack.pop() as LiteralList;

  if (!list.value.length) return;

  const first = list.value.shift() as Factor;

  exec([first, ...list.value.flatMap((item) => [item, ...program.value])]);
});

// [C] [B] [A] -> B || A
export const ifte = new Combinator(['ifte'], ['quotation', 'quotation', 'quotation'], ({ stack, exec }) => {
  const rightOption = stack.pop() as Quotation;
  const leftOption = stack.pop() as Quotation;
  const test = stack.pop() as Quotation;

  exec(test.value, () => {
    const result = stack.pop();
    if (!(result instanceof LiteralTruth)) {
      throw new Error('ifte: test should return a literal truth');
    }
    if (result.value === true) {
      stack.push(leftOption);
    } else {
      stack.push(rightOption);
    }
  });
});

// Until [T] is true, run [P]
export const until = new Combinator(['until'], ['quotation', 'quotation'], ({ stack, exec }) => {
  const program = stack.pop() as Quotation;
  const test = stack.pop() as Quotation;

  recurse();

  function recurse() {
    exec([...program.value, ...test.value], () => {
      const tested = stack.pop();

      if (!(tested instanceof LiteralTruth)) {
        throw new Error('until: test should return a truth value');
      }

      if (tested.value !== true) {
        recurse();
      }
    });
  }
});

export const reverse = new Combinator(['reverse'], ['quotation'], ({ stack }) => {
  const q = stack.pop() as Quotation;
  q.value.reverse();
  stack.push(q);
});

const combinators = {};

[
  concat, cons, unit,
  i,
  map, filter, reduce,
  ifte,
  until,
  reverse,
].forEach((combinator) => {
  combinator.aliases.forEach((alias) => {
    combinators[alias] = combinator;
  });
});

export default combinators;
