---
title: Minds, words, and stories
---

## Words (Factors)
Every mind has a dictionary containing word definitions. A word is either an built-in combinator, operator, literal, or it's an alias for a term.

## Literal

## Operator

## Combinator


## Term
A term is a list of factors.

## Concatenation
Denotes function composition.

## Quotation


## Stack


## Compiler (JIT)
```
reserved-characters ::= "[" | "]" | "{" | "}" | ";" | "."
integer-constant ::= [ - ] ( 0-9 ) { 0-9 }
escaped-character ::= "\n" | "\t" | "\b" | "\r" | "\f" | "\'" | "\""
ordinary-character ::= any except "\"
string-constant ::=
 '"' { escaped-character | ordinary-character } '"'
character-constant ::=
 "'" ( escaped-character | ordinary-character )
reserved-word ::= "==" | "MODULE" | "PRIVATE" | "PUBLIC"
atomic-symbol ::= { [a-zA-Z] | [0-9] | "_" | "-" }
name ::= atomic-symbol
token ::=
 reserved-character| reserved-word | integer-constant |
 character-constant | string-constant | atomic-symbol
```

## Interpreter (Byte-code)
one of these Joy inspired languages.

- simple syntax
- homoiconicity (code as data)
- self-interpreted
- introspection, reflection and metaprogramming
- simple algebra, with programs easily manipulated by hand
- literals of any type cause a value of that type to be pushed onto the stack
- lists are just special cases of quoted programs
- a function can consume any number of parameters from the stack and leave any number of results on the stack

## Mind

   `💭  🗺️ 🎒 ⛰️  🚩 💰`
🧙

Every agent has a mind consisting of:
1. a stack of mental objects ("things");
2. a set of common words and;
3. a set of character-based functions

## Context

## Messages
Agents can receive messages and evaluate them.
Message transmit in 2-byte packets.

` 💬`
`🧚 [he][..] 🐌`
`🧚 [ll][he] 🐌`
`🧚 [o ][ll] 🐌`
`🧚 [wo][o ] 🐌`
`🧚 [rl][wo] 🐌`
`🧚 [d.][rl] 🐌`
`🧚 [..][d.] 🐌`
`🧚 [..][..] 🐌`

Agents can communicate with each other by sending messages to each other's cell.

`      💬  `
`[##] 🧙 [++][__]
`            [__][👨][__]
`                    [++] 👨 [##]`
Agents can also communicate if they stand at both ends of a route and use a proxy.

## Precondition

## Choices
Agents have a bag of content with preconditions.

## Branch

## Player knowledge

## Causality
State of the story. State machine. Player knowledge or plot events.

States imply their previous state.

## Plot
Events.

## Story
story -> branches -> prose -> choices

Systematizing the flow of causality in a simple and meaningful way:
 - Stories are built around recording player knowledge
 - Stories are told through "encounters"
 - Track causality, the "state of the story": player knowledge or plot events
 - Flat state machines track plots
 - Checks: if state_reached(), if state_between(a,b)
 - Decisions have consequences
 - Feedback should be unambiguous
