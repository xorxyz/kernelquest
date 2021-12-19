import { debug } from "../../utils";
import { Interpretation } from "../interpreter";
import { LiteralNumber, LiteralRef, Quotation } from "./literals";
import { Operator } from "./operators";

export class Combinator extends Operator {}

export const concat = new Combinator(['concat'], ['quotation', 'quotation'], stack => {
  const a = stack.pop() as Quotation;
  const b = stack.pop() as Quotation;

  stack.push(new Quotation({
    term: b.value.term.concat(a.value.term),
    tokens: b.value.tokens.concat(a.value.tokens)
  }));
});

// [b] [a] -> [[b] a]
export const cons = new Combinator(['cons'], ['quotation', 'quotation'], stack => {
  const a = stack.pop() as Quotation;
  const b = stack.pop() as Quotation;

  const next = new Quotation();

  next.add(b);
  a.value.term.forEach(factor => {
    debug('factor', factor);
    next.add(factor)
  });
  
  stack.push(next);
});

// [a] -> [[a]]
export const unit = new Combinator(['unit'], ['quotation'], stack => {
  const a = stack.pop() as Quotation;
  const next = new Quotation();

  next.add(a);
  stack.push(next);
});

export const i = new Combinator(['i', 'exec'], ['quotation'], stack => {
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
export const dip = new Combinator(['dip'], ['quotation', 'quotation'], stack => {
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

export const map = new Combinator(['map'], ['quotation', 'quotation'], stack => {
  const program = stack.pop() as Quotation;
  const list = stack.pop() as Quotation;

  const interpretation = new Interpretation(program.value);
  const results = new Quotation();

  list.value.term.map(factor => {
    stack.push(factor);
    interpretation.run(stack);
    const result = stack.pop();
    if (result) {
      results.add(result);
    }
  });

  stack.push(results);
});

export const ref = new Operator(['ref'], ['number', 'number'], stack => {
  const y = stack.pop() as LiteralNumber;
  const x = stack.pop() as LiteralNumber;
  const ref = new LiteralRef(x.value, y.value);
  ref.render('cell');
  stack.push(ref);
});

export const struct = new Operator(['struct'], ['ref', 'number', 'number'], stack => {
  stack.pop() as LiteralNumber;
  stack.pop() as LiteralNumber;
  stack.pop() as LiteralRef;

  const ref = new LiteralRef(0, 0);
  ref.render('struct')
  stack.push(ref);
});

export const route = new Operator(['route'], ['ref', 'ref'], stack => {
  stack.pop() as LiteralRef;
  stack.pop() as LiteralRef;
  const ref = new LiteralRef(0, 0);
  ref.render('route');
  stack.push(ref);
});

const combinators = {};

[
  concat, cons, unit, 
  i, dip,
  map,
  ref, struct, route  
].forEach(combinator => {
  combinator.aliases.forEach(alias => {
    combinators[alias] = combinator;
  })
})

export default combinators;
