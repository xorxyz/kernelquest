/*
 * Written by Jonathan Dupré
 * Copyright 2019-2020-2021-2022 Diagonal Systems Inc.
 */
import { Engine } from 'xor4-game/engine';
import { World } from 'xor4-game/engine/world';
import GameServer from './server';

const PORT = process.env.PORT || 3000;
const world = new World();
const engine = new Engine({ world });
const server = new GameServer(engine);

(async function main() {
  server.listen(PORT, () => {
    console.log('listening on', PORT);

    engine.start();
  });
}());
