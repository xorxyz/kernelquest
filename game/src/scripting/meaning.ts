import { Stack } from './stack';
import { Atom } from './atom';
import { IAction } from '../shared/interfaces';
import { Queue } from '../shared/queue';

type InstanceTypeOfConstructors<T> = {
  [K in keyof T]: T[K] extends new (...args: never[]) => infer R ? R : never;
};

export type InterpretMeaningFn<A> = (
  stack: Stack, args: InstanceTypeOfConstructors<A>, queue: Queue<Atom>
) => IAction | null

type AtomCtor = new (...args: never[]) => Atom

export type WordArguments = Record<string, AtomCtor>

export interface IMeaning<A extends WordArguments> {
  args: A
  words?: string[]
  sig: (keyof A)[]
  interpret: (stack: Stack, expr: Queue<Atom>) => IAction | null
  $interpret: InterpretMeaningFn<A>
}

export interface CreateMeaningParams<A extends WordArguments> {
  args: A
  words?: string[]
  sig: (keyof A)[],
  interpret?: InterpretMeaningFn<A>
}

function validate<A extends WordArguments>(
  argsDef: A, args: Record<string, Atom>,
): args is InstanceTypeOfConstructors<A> {
  return Object.entries(argsDef).every(([key, Ctor]) => args[key] instanceof Ctor);
}

export function interpret<A extends WordArguments>(
  this: IMeaning<A>,
  stack: Stack,
  queue: Queue<Atom>,
): IAction | null {
  if (stack.size < this.sig.length) {
    throw new Error(`Expected to find ${this.sig.length} values on the stack, but found ${stack.size}.`);
  }

  const popped = stack.popN(this.sig.length).reverse();
  const myArgs = Object.fromEntries(popped
    .map((atom, index): [keyof A | undefined, Atom] => [this.sig[index], atom])
    .filter((kv): kv is [keyof A, Atom] => !!kv[0])
    .reduce((record, [key, atom]) => {
      record.set(key, atom);
      return record;
    }, new Map<keyof A, Atom>()));

  if (!validate(this.args, myArgs)) {
    // The action failed validation, revert the stack back to its original state
    popped.forEach((atom) => { stack.push(atom); });
    throw new Error(`The values on the stack don't match the function signature: [${this.sig.join(' ')}]`);
  }

  return this.$interpret(stack, myArgs, queue);
}

export function createMeaning<A extends WordArguments>(
  params: CreateMeaningParams<A>,
): IMeaning<A> {
  const meaning: IMeaning<A> = {
    ...params,
    interpret,
    $interpret: params.interpret ?? ((): null => null),
  };

  meaning.interpret = interpret.bind(meaning);

  return meaning;
}
