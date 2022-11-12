import { getRandom, forN } from 'xor4-lib';
import { Agent } from '../src/agent';

/** @category Capability */
export abstract class Capability {
  abstract bootstrap (agent: Agent): void
  abstract run (agent: Agent, tick: number): void
}

/** @category Capabilities */
export class RandomWalkCapability extends Capability {
  bootstrap() {}

  run(agent: Agent, tick: number) {
    if (agent.mind.queue.size !== 0 || tick % 10 !== 0) return;
    const n = getRandom(0, 3) as 0 | 1 | 2 | 3;

    if (n) {
      forN(n, () => {
        agent.mind.queue.add({ name: 'rotate' });
        agent.mind.queue.add({ name: 'wait', args: { duration: 12 } });
      });
    }
    agent.mind.queue.add({ name: 'step' });
    agent.mind.queue.add({ name: 'wait', args: { duration: 12 } });
  }
}
