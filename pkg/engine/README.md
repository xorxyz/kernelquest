# engine

the xor4 engine.

- entity-component-systems pattern
- extensible

# usage

```ts
import engine from './pkg/engine/src';
import * as systems from './pkg/engine/lib/systems;

const engine = new Engine();

systems.forEach(s => {
  engine.register(s);
});

engine.start();

```

# systems

every GameSystem subclass needs to implement the `init` and `update` functions.

```ts
init ()

update ()

``` 
