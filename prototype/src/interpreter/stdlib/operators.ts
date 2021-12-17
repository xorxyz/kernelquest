import { Stack } from "../../../../lib/stack";
import { Factor, Literal, StackFn } from "../types";
import { LiteralNumber, LiteralString } from "./literals";

export class Operator extends Factor {
  signature: Array<string>
  execute: StackFn
  aliases: Array<string>

  constructor (aliases: Array<string>, signature: Array<string>, execute: StackFn) {
    super(aliases[0]);
    this.signature = signature;
    this.execute = execute;
    this.aliases = aliases;
  }

  validate (stack: Stack<Factor>) {
    if (this.signature.length > stack.length) {
      throw new Error(
        'missing operand(s), expected ' + this.signature.join(', ')
      );
    }

    const args = stack.slice(-this.signature.length);

    args.forEach((arg: Factor, i) => {
      const type = this.signature[i];
      if (!(arg instanceof Literal)) {
        throw new Error('arg not instanceof Literal');
      }
      if (type !== 'any' && arg.type !== type) {
        throw new Error(
          `signature doesn't match stack type. 
          expected: '${type}' got: '${arg.type}' at arg ${i}`
        );
      }
    });
  }
}

export const sum = new Operator(['+', 'sum', 'add'], ['number', 'number'], (stack) => {
  const [b] = stack.popN(1);
  const [a] = stack.popN(1);
  const result = (a as LiteralNumber).value + (b as LiteralNumber).value;

  stack.push(new LiteralNumber(result));
});

export const difference = new Operator(['-', 'minus'], ['number', 'number'], (stack) => {
  const [b] = stack.popN(1);
  const [a] = stack.popN(1);
  const result = (a as LiteralNumber).value - (b as LiteralNumber).value;

  stack.push(new LiteralNumber(result));
});

export const product = new Operator(['*', 'mul'], ['number', 'number'], (stack) => {
  const [b] = stack.popN(1);
  const [a] = stack.popN(1);
  const result = (a as LiteralNumber).value * (b as LiteralNumber).value;

  stack.push(new LiteralNumber(result));
});

export const division = new Operator(['/', 'quotient'], ['number', 'number'], (stack) => {
  const [b] = stack.popN(1);
  const [a] = stack.popN(1);
  const result = (a as LiteralNumber).value / (b as LiteralNumber).value;

  stack.push(new LiteralNumber(result));
});

export const dup = new Operator(['dup'], ['any'], stack => {
  const a = stack.pop();

  stack.push(a);
  stack.push(a);
});

export const swap = new Operator(['swap'], ['any', 'any'], stack => {
  const a = stack.pop();
  const b = stack.pop();

  stack.push(a);
  stack.push(b);
});

export const drop = new Operator(['drop', 'zap', 'pop'], ['any'], stack => {
  stack.pop();
});

export const cat = new Operator(['cat'], ['string', 'string'], stack => {
  const a = stack.pop() as LiteralString;
  const b = stack.pop() as LiteralString;

  stack.push(new LiteralString(a.value + b.value));
});


const operators = {};

[
  sum, difference, product, division,
  dup, swap, drop, cat
].forEach(operator => {
  operator.aliases.forEach(alias => {
    operators[alias] = operator;
  })
})

export default operators;
