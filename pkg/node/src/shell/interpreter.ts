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
import { Player } from '../engine/actors/actors';
import { createHWall, createVWall } from '../engine/magic/effects';
import Engine from '../engine/engine';
import {
  Item, DataStack, BooleanLiteral, NumberLiteral,
} from '../engine/things/items';

const operators = {
  t: (stack: DataStack) => {
    stack.push(new BooleanLiteral(true));
    return stack;
  },
  f: (stack: DataStack) => {
    stack.push(new BooleanLiteral(false));
    return stack;
  },
};

export default class Interpreter extends EventEmitter {
  stack: DataStack
  private engine: Engine
  private player: Player

  constructor(engine: Engine, player: Player) {
    super();

    this.engine = engine;
    this.player = player;
    this.stack = player.stack;
  }

  eval(expr: string): Item | null {
    debug(`expression: \`${expr}\``);

    const tokens = expr.split(' ');

    debug('tokens:', tokens);

    if (expr === 't') operators.t(this.stack);

    // number
    if (tokens.length === 1 && isNumeric(tokens[0])) {
      const n = Number(tokens[0]);
      if (n >= 0 && n < 256) {
        debug('number:', n);
        this.stack.push(new NumberLiteral(n));
      }
    }

    if (tokens[2] === 'tele' && tokens.length === 3) {
      const [x, y] = tokens.slice(0, 2).map(Number);

      this.player.position.setXY(x, y);

      operators.t(this.stack);
    }

    if (tokens[1] === 'hwall' && tokens.length === 2) {
      const length = Number(tokens[0]);
      debug('hwall', length);
      createHWall(length, this.player.position).forEach((wall) => {
        this.engine.walls.push(wall);
      });

      operators.t(this.stack);
    }

    if (tokens[1] === 'vwall' && tokens.length === 2) {
      const length = Number(tokens[0]);
      debug('vwall', length);
      createVWall(length, this.player.position).forEach((wall) => {
        this.engine.walls.push(wall);
      });

      operators.t(this.stack);
    }

    return this.stack.pop() || null;
  }
}
