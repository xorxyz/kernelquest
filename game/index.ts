/*
 * Written by Jonathan Dupré
 * Copyright Diagonal Systems Inc.
 */
import { Engine } from './engine/engine';
import GameServer from './server/server';

const PORT = process.env.PORT || 3000;

const engine = new Engine();
const server = new GameServer(engine);

server.listen(PORT, () => {
  console.log('listening on', PORT);

  engine.start();
});
