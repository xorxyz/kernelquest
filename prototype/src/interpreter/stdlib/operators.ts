import { Stack } from "../../../../lib/stack";
import { Factor, Literal, StackFn } from "../types";
import { LiteralNumber } from "./literals";

export class Operator extends Factor {
  signature: Array<string>
  execute

  constructor (lexeme: string, signature: Array<string>, execute: StackFn) {
    super(lexeme);
    this.signature = signature;
    this.execute = execute;
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

export const sum = new Operator('+', ['number', 'number'], (stack) => {
  const [b] = stack.popN(1);
  const [a] = stack.popN(1);
  const result = (a as LiteralNumber).value + (b as LiteralNumber).value;

  stack.push(new LiteralNumber(result));
});

export const difference = new Operator('-', ['number', 'number'], (stack) => {
  const [b] = stack.popN(1);
  const [a] = stack.popN(1);
  const result = (a as LiteralNumber).value - (b as LiteralNumber).value;

  stack.push(new LiteralNumber(result));
});

export const product = new Operator('*', ['number', 'number'], (stack) => {
  const [b] = stack.popN(1);
  const [a] = stack.popN(1);
  const result = (a as LiteralNumber).value * (b as LiteralNumber).value;

  stack.push(new LiteralNumber(result));
});

export const division = new Operator('/', ['number', 'number'], (stack) => {
  const [b] = stack.popN(1);
  const [a] = stack.popN(1);
  const result = (a as LiteralNumber).value / (b as LiteralNumber).value;

  stack.push(new LiteralNumber(result));
});

const operators = {};

[sum, difference, product, division].forEach(operator => {
  operators[operator.lexeme] = operator;
})

export default operators;
