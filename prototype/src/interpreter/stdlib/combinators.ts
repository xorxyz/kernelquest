import { Interpretation } from "../interpreter";
import { StackFn } from "../types";
import { LiteralString, Quotation } from "./literals";
import { Operator } from "./operators";

export class Combinator extends Operator {
  signature: Array<string>
  aliases: Array<string>
  execute: StackFn

  constructor (aliases, signature, execute: StackFn) {
    super(aliases[0], signature, execute);

    this.aliases = aliases;
  }
}

export const dup = new Combinator(['dup'], ['any'], stack => {
  const a = stack.pop();

  stack.push(a);
  stack.push(a);
});

export const swap = new Combinator(['swap'], ['any', 'any'], stack => {
  const a = stack.pop();
  const b = stack.pop();

  stack.push(a);
  stack.push(b);
});

export const drop = new Combinator(['drop', 'zap', 'pop'], ['any'], stack => {
  stack.pop();
});

export const cat = new Combinator(['cat'], ['string', 'string'], stack => {
  const a = stack.pop();
  const b = stack.pop();

  stack.push(new LiteralString(a.value + b.value));
});

export const concat = new Combinator(['concat'], ['quotation', 'quotation'], stack => {
  const a = stack.pop();
  const b = stack.pop();

  stack.push(new Quotation(b.value.concat(a.value)));
});

export const i = new Combinator(['i', 'exec'], ['quotation'], stack => {
  const quotation = stack.pop() as Quotation;
  
  const interpretation = new Interpretation(quotation.program);

  try {
    interpretation.start(stack);
  } catch (err) {
    console.error('i crashed')
    stack.push(quotation);
  }
});

export const cons = new Combinator(['cons'], ['quotation', 'any'], stack => {
  const thing = stack.pop();
  const quotation = stack.pop() as Quotation;
  
  if (thing) quotation.push(thing);
  stack.push(quotation);
});

export const map = new Combinator(['map'], ['quotation', 'quotation'], stack => {
  // const list: Quotation = stack.pop();
  // const operations: Quotation = stack.pop();

  stack.push(new LiteralString('TODO'))
});

const combinators = {};

[dup, swap, drop, cat, concat, i, cons, map].forEach(combinator => {
  combinator.aliases.forEach(alias => {
    combinators[alias] = combinator;
  })
})

export default combinators;
