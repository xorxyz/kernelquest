import { Interpretation } from "../interpreter";
import { Quotation } from "./literals";
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

export const cons = new Combinator(['cons'], ['quotation', 'any'], stack => {
  const thing = stack.pop();
  const quotation = stack.pop() as Quotation;
  
  if (thing) quotation.push(thing);
  stack.push(quotation);
});

export const map = new Combinator(['map'], ['quotation', 'quotation'], stack => {
  const program = stack.pop() as Quotation;
  const list = stack.pop() as Quotation;

  const interpretation = new Interpretation(program.value);

  list.value.term.map(factor => {
    stack.push(factor);
    interpretation.run(stack);
  });
});

const combinators = {};

[concat, i, cons, map].forEach(combinator => {
  combinator.aliases.forEach(alias => {
    combinators[alias] = combinator;
  })
})

export default combinators;
