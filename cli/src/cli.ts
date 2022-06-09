/*
 Written by Jonathan Dupré
 Copyright 2019-2020-2021-2022 Diagonal Systems Inc.
 */
import readline from 'readline';
import { Engine, Agent, Area, World } from 'xor4-game/src';
import { EvalAction } from 'xor4-game/lib';
import { Spirit } from 'xor4-game/src/agent';
import { Vector } from 'xor4-lib/math';

export default async function cli() {
  const { engine, agent } = createGameEngine();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '$ ',
    terminal: false,
  });

  rl.on('close', () => process.exit(0));

  rl.on('line', (line): void => {
    if (!line) { return; }
    rl.pause();

    const now = agent.mind.tick;

    agent.schedule(new EvalAction(line));

    engine.once('end-turn', () => {
      engine.once('end-turn', () => {
        const logs = agent.logs.filter((log) => log.tick >= now && log.tick <= agent.mind.tick);

        logs.forEach((log) => console.log(`${log.message}`));

        console.log(`t: ${now}-${agent.mind.tick}, s: [ ${agent.mind.stack} ], m: ${agent.logs.map((l) => l.tick)}`);
        rl.prompt();
      });
    });
  });

  engine.start();

  rl.prompt();
}

function createGameEngine() {
  const room = new Area(0, 0);
  const world = new World([room]);
  const engine = new Engine({ world });

  const agent = new Agent(new Spirit());

  [agent].forEach((x) => room.put(x, new Vector(0, 0)));

  return { engine, room, agent };
}

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
});
