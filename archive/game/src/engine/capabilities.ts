import { getRandom, forN } from '../shared';
import { Agent } from './agent';

/** @category Capability */
export abstract class Capability {
  abstract bootstrap (agent: Agent): void
  abstract run (agent: Agent, tick: number): void
}

/** @category Capabilities */
export class RandomWalkCapability extends Capability {
  bootstrap() {

  }

  run(agent: Agent, tick: number) {
    if (agent.halted) return;
    if (agent.mind.queue.size !== 0 || tick % 10 !== 0) return;
    const n = getRandom(0, 3) as 0 | 1 | 2 | 3;

    if (n) {
      forN(n, () => {
        agent.mind.queue.add({ name: 'right' });
      });
    }
    agent.mind.queue.add({ name: 'step' });
  }
}
