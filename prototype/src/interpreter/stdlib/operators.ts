import { Stack } from "../../../../lib/stack";
import { Factor, Term } from "../compiler";

export class Operator extends Factor {
  signature: Array<string>
  execute

  constructor (lexeme: string, signature: Array<string>, execute) {
    super(lexeme);
    this.signature = signature;
    this.execute = execute;
  }

  validate (stack: Stack<Factor | Term>) {
    if (this.signature.length > stack.length) {
      throw new Error('missing operand(s)');
    }
  
    this.signature.forEach((argumentType, i) => {
      const a = stack.peekN(i);
      if (argumentType !== 'any' && typeof a !== argumentType) {
        throw new Error('fn signature doesnt match at least one stack type');
      }
    })
  }
}

export const SumOperator = new Operator('+', ['number', 'number'], stack => {
  const b = stack.pop();
  const a = stack.pop();
  const result = a + b;

  stack.push(result);
});

const operators = {};

[SumOperator].forEach(operator => {
  operators[operator.lexeme] = operator;
});

export default operators;


// export class DifferenceOperator extends Operator {
//   lexeme = '-'
//   signature = ['number', 'number']

//   fn (stack) {  
//     const b = stack.pop();
//     const a = stack.pop();
//     const result = a - b;
  
//     stack.push(result);
//   }
// }

// export class ProductOperator extends Operator {
//   lexeme = '*'
//   signature = ['number', 'number']

//   fn (stack) {  
//     const b = stack.pop();
//     const a = stack.pop();
//     const result = a * b;
  
//     stack.push(result);
//   }
// }

// export class DivisionOperator extends Operator {
//   lexeme = '/'
//   signature = ['number', 'number']

//   fn (stack) {  
//     const b = stack.pop();
//     const a = stack.pop();
//     const result = a / b;
  
//     stack.push(result);
//   }
// }

// const operators = {};

// [
//   SumOperator,
//   DifferenceOperator,
//   ProductOperator,
//   DivisionOperator
// ].forEach(ctor => {
//   operators[ctor.lexeme] = ctor;
//   ctor.aliases.forEach(alias => {
//     operators[alias] = ctor;
//   })
// })
