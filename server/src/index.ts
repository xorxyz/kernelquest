/*
 * Written by Jonathan Dupré
 * Copyright 2019-2020-2021-2022 Diagonal Systems Inc.
 */
import { Engine, Place, World } from 'xor4-game';
import { create } from 'xor4-game/lib/create';
import GameServer from './server';

export const demoRoom = new Place(0, 0, function (this: Place) {
  create.wizard.call(this, 4, 4);

  create.trees.call(this, [[5, 0], [1, 1], [3, 1], [4, 1], [0, 2], [1, 4]]);
  create.grass.call(this, [[15, 4], [11, 0], [5, 9], [3, 2]]);
  create.water.call(this, [[15, 0], [15, 1], [14, 2], [15, 2]]);

  const entities: Array<[string, Array<any>]> = [
    // ['bug', [5, 4]],
    // ['sheep', [15, 5]],
    // ['house', [9, 2, 5, 4]],
    ['house', [2, 6, 3, 3]],
    ['flag', [14, 8]],
    // ['book', [4, 0]],
    // ['gold', [11, 8]],
    ['crown', [11, 9]],
  ];

  entities.forEach(([entity, args]) => create[entity].call(this, ...args));
});

const PORT = process.env.PORT || 3000;
const world = new World([demoRoom]);
const engine = new Engine({ world });
const server = new GameServer(engine);

(async function main() {
  server.listen(PORT, () => {
    console.log('listening on', PORT);

    engine.start();
  });
}());
