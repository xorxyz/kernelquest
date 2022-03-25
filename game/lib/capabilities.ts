import { getRandom, forN } from 'xor4-lib/math';
import { RotateAction, StepAction, WaitAction } from './actions';
import { Agent } from '../src/agent';
import { Capability } from '../src/capability';

/** @category Capabilities */
export class RandomWalkCapability extends Capability {
  bootstrap() {}

  run(agent: Agent, tick: number) {
    if (agent.mind.queue.size !== 0 || tick % 10 !== 0) return;
    const n = getRandom(0, 3) as 0 | 1 | 2 | 3;

    if (n) {
      forN(n, () => {
        agent.mind.queue.add(new RotateAction());
        agent.mind.queue.add(new WaitAction(agent.weight * 2));
      });
    }

    agent.mind.queue.add(new StepAction());
    agent.mind.queue.add(new WaitAction(agent.weight * 2));
  }
}
