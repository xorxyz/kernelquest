/* interpret the player's intention by evaluating expressions

  reserved-character  ::=
    "["  |  "]"  |  "{"  |  "}"  |  ";"  |  "."

  escaped-character  ::=
    "\n"                    newline
    |  "\t"                 tab
    |  "\b"                 backspace
    |  "\r"                 carriage return
    |  "\f"                 formfeed
    |  "\'"                 single quote
    |  "\""                 double quote

  integer-constant  ::=
    [ "-" ]  ( "0" | "1" .. | "9" )  { "0" | "1" .. | "9" }
  string-constant  ::=
    '"'  { escaped-character | ordinary-character } '"'
  character-constant  ::=
    "'"  ( escaped-character | ordinary-character )

  token  ::=
    reserved-character | reserved-word
    | integer-constant | float-constant
    | character-constant |  string-constant
    | atomic-symbol

  factor  ::=
      atomic-symbol
      |  integer-constant | float-constant
      |  character-constant | string-constant
      |  "{"  { character-constant | integer-constant } "}"
      |  "["  term  "]"

  term  ::=
      { factor }

  literal  ::=
      "true"  |  "false"
      |  integer-constant | float-constant
      |  character-constant | string-constant
      |  "{"  { character-constant | integer-constant } "}"
      |  "["  term  "]"

  simple-definition  ::=
        atomic-symbol  "=="  term

  cycle  ==
    {    compound-definition
    |  term  ( "END" | "." ) }
*/
import * as EventEmitter from 'events';
import { debug } from '../../lib/logging';
import { isNumeric } from '../../lib/utils';
import {
  Item,
  ItemStack,
  BooleanLiteral,
  NumberLiteral,
} from '../engine/things/items';
import { Stack } from '../../lib/stack';

const operators = {
  t: (stack: ItemStack) => {
    stack.push(new BooleanLiteral(true));
    return stack;
  },
  f: (stack: ItemStack) => {
    stack.push(new BooleanLiteral(false));
    return stack;
  },
  num: (stack: ItemStack, n: number) => {
    if (n >= 0 && n < 256) stack.push(new NumberLiteral(n));
    return stack;
  },
};

export default class Interpreter extends EventEmitter {
  private stack: ItemStack
  private quotations: ItemStack

  constructor(stack: ItemStack) {
    super();

    this.stack = stack;

    this.quotations = new Stack();
  }

  eval(expr: string): Item | null {
    debug(`expression: \`${expr}\``);
    const tokenize = (e: String) => e.split(' ');
    const tokens = tokenize(expr);
    debug('tokens:', tokens);

    if (expr === 't') operators.t(this.stack);
    if (expr === 'f') operators.f(this.stack);
    if (tokens.length === 1 && isNumeric(tokens[0])) {
      operators.num(this.stack, Number(tokens[0]));
    }

    return this.stack.pop() || null;
  }
}
