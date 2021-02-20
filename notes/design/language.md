# design of the language

> "one of these Joy inspired languages"

- literals of any type cause a value of that type to be pushed onto the stack
- lists are just special cases of quoted programs
- a function can consume any number of parameters from the stack and leave any number of results on the stack

# datatypes

1. simple: 
  1. integers: 5
  2. floating point: 1.2, 1.23, 6.5e3, 23.1e-1 
  2. characters: 'a 'A
  3. boolean: true false 
2. aggregate: 
  1. sets: { 1 2 3 } 
  2. strings: "hello world"
  3. lists, or quoted programs: []

# built-in operators and combinators

- definition 
  - == 
  - ;
- arithmetics
  - +  -  *  / 
- logic
  - =  <  >  !=  <=  >=
  - not and or
- list operations
  - map filter 
  - fold
  - concat
- control flow
  - i
  - ifte
- stack shuffling
  - swap
  - dup
  - pop
  - dip

```xor

2 3 +
[1 2 3] [4 5 6 7] concat
[1 2 3 4] [dup *] map
square == dup *  
[2 5 3] 0 [+] fold
[dup cons i] dup cons i

```

# notes

- no state, no environment
- homoiconicity (code as data) 
- self-hosting compiler
- self-interpreter
- strongly typed
- introspection, reflection and metaprogramming
- actor-based concurrency
- coroutines

inspirations:

- joy
- factor
- forth
- lisp
- scheme 
- sh

ideas:

- actors have bags of analogies?
