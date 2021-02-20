/*
  reserved-character  ::=
    "["  |  "]"  |  "{"  |  "}"  |  ";"  |  "."

  escaped-character  ::=
    "\n"                    newline
    |  "\t"                     tab
    |  "\b"                     backspace
    |  "\r"                     carriage return
    |  "\f"                     formfeed
    |  "\'"                     single quote
    |  "\""                     double quote

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

export enum Tokens {
  LEFT_BRACKET,
  RIGHT_BRACKET,
  STRING_LITTERAL,
  WORD,
}
