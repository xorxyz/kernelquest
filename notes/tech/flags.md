# flags

## sequence?

1. generate a token
1. encode the token in a flag string
1. generate a key
1. encode the key as level interactions
1. encrypt the flag string with the key
1. derive a csrf token from the encrypted flag string
1. include csrf token when serving html
