# design of the language

> "one of these Joy inspired languages"

- literals of any type cause a value of that type to be pushed onto the stack
- lists are just special cases of quoted programs
- a function can consume any number of parameters from the stack and leave any number of results on the stack

# data types

```
domain == 1 or more shards
shard  == 64 zones
zone   == 32 rooms
room   == 16 rows x 10 cols
col    == 10 cells
row    == 16 cells
cell   == 2 bytes
char   == 1 byte
```

1. simple: 
  1. boolean: 00 01
  2. integers: 00 01 03 1F FF (0-255)
  3. chars: 🧙  (2 bytes)
  2. floating point: 1.2, 1.23, 6.5e3, 23.1e-1 
  2. characters: 'a 'A
2. aggregate:
  1. lists, or quoted programs: []
  2. strings: "hello world"
  3. sets: { 1 2 3 } 

# built-in operators and combinators

- calculator
  - +  -  *  / 
- logic
  - =  <  >  !=  <=  >=
  - not and or
- execution
  - i
- control
  - ifte
- stack
  - swap
  - dup
  - pop
  - dip
- list
  - map
  - filter 
  - fold
  - concat
- clipboard
  - copy
  - cut
  - paste
- definition
  - == 
  - ;

```xor

2 3 +
[1 2 3] [4 5 6 7] concat
[1 2 3 4] [dup *] map
square == dup *  
[2 5 3] 0 [+] fold
[dup cons i] dup cons i
[wall 5 2 0]
  -> [wall 5 2 0]

environment == [ room zone world node ]
xor_agent == [
  [ percepts sensors ]    # inputs
  [
    [ state model ]       # agent's representation of the world
                          # "bags of analogies"
    [ data stack ]        # program's data stack
  ] utility               # agent's utility function
  [ actions actuators ]   # outputs
] environment

```

# notes

- simple syntax
- homoiconicity (code as data) 
- self-interpreted
- introspection, reflection and metaprogramming

inspirations:

- joy
- factor
- forth
- lisp
- scheme 
- ksh
