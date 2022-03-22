/*
 Written by Jonathan Dupré
 Copyright 2019-2020-2021-2022 Diagonal Systems Inc.
 */
import readline from 'readline';
import { Engine } from 'xor4-game/engine';
import { Agent } from 'xor4-game/engine/agents';
import { Place } from 'xor4-game/engine/places';
import { World } from 'xor4-game/engine/world';
import { EvalAction } from 'xor4-game/lib/actions';
import { Spirit, Sheep } from 'xor4-game/lib/agents';

let lastTick = 0;

(async function main() {
  const { engine, spirit } = createGameEngine();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '$ ',
    terminal: false,
  });

  rl.on('close', () => process.exit(0));

  rl.on('line', (line): void => {
    if (!line) { return; }

    spirit.schedule(new EvalAction(line));

    engine.wait(() => {
      const observations = spirit.mind.memory.filter((o) => o.tick > lastTick);
      observations.forEach((o) => console.log(`${o.message}`));
      console.log(`t: ${engine.clock.now}, [ ${spirit.mind.stack} ]`);
      rl.prompt();
      lastTick = engine.clock.now;
    });
  });

  engine.start();

  rl.prompt();
}());

function createGameEngine() {
  const room = new Place(0, 0, 16, 10);
  const world = new World([room]);
  const engine = new Engine({ world });

  const spirit = new Agent(new Spirit());
  const sheep = new Agent(new Sheep());

  [spirit, sheep].forEach((x) => room.put(x));

  return { engine, room, spirit };
}

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
});
