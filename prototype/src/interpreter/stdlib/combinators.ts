import { Stack } from "../../../../lib/stack";
import { Factor, StackFn } from "../compiler";

export class Combinator extends Factor {
  signature: Array<string>
  aliases: Array<string>
  execute: StackFn

  constructor (aliases, signature, execute: StackFn) {
    super(aliases[0]);

    this.aliases = aliases;
    this.signature = signature;
    this.execute = execute;
  }

  validate (stack: Stack<Factor>) {
    if (this.signature.length > stack.length) {
      throw new Error(
        'missing operand(s), expected ' + this.signature.join(', ')
      );
    }

    this.signature.forEach((argumentType, i) => {
      const a = stack.peekN(i);
      if (argumentType !== 'any' && typeof a !== argumentType) {
        throw new Error(
          `signature doesn't match stack type. 
          expected: ${this.signature.join(', ')})
          got: ${stack.slice(0, this.signature.length - 1).join(', ')})`
        );
      }
    })
  }
}

export const Dup = new Combinator(['dup'], ['any'], stack => {
  const a = stack.pop();

  stack.push(a);
  stack.push(a);
});

const combinators = {};

[Dup].forEach(combinator => {
  combinator.aliases.forEach(alias => {
    combinators[alias] = combinator;
  })
})

export default combinators;

// export class Swap extends Combinator {
//   lexeme = 'swap'
//   signature = ['any', 'any']

//   fn (stack) {
//     const a = stack.pop();
//     const b = stack.pop();
  
//     stack.push(a);
//     stack.push(b);
//   }
// }

// export class Drop extends Combinator {
//   lexeme = 'drop'
//   signature = ['any']
//   aliases = ['pop', 'zap']

//   fn (stack) {
//     stack.pop();
//   }
// }
