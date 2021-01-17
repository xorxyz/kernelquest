# engine

the xor4 engine.

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
