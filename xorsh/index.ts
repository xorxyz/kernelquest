/*
 * Written by Jonathan Dupré
 * Copyright 2019-2020-2021 Diagonal Systems Inc.
 */
import { Engine } from '../game/engine/engine';
import { World } from '../game/engine/world';
import GameServer from '../game/server/server';

const PORT = process.env.PORT || 3000;
const world = new World();
const engine = new Engine({ world });
const server = new GameServer(engine);

(async function main () {
  console.log('loading world...');
  await world.load();

  server.listen(PORT, () => {
    console.log('listening on', PORT);
  
    engine.start();
  });
})()
