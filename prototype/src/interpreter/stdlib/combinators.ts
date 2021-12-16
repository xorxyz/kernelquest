import { StackFn } from "../types";
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
