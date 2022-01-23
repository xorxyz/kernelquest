import { getRandom } from 'xor4-lib/math';
import { forN } from 'xor4-lib/utils';
import { RotateAction, StepAction, WaitAction } from './actions';
import { Agent, Capability } from '../engine/agents';

export class RandomWalkCapability extends Capability {
  bootstrap() {}

  run(agent: Agent, tick: number) {
    if (agent.queue.size !== 0 || tick % 10 !== 0) return;
    const n = getRandom(0, 3) as 0 | 1 | 2 | 3;

    if (n) {
      forN(n, () => {
        agent.queue.add(new RotateAction());
        agent.queue.add(new WaitAction(agent.type.weight * 2));
      });
    }

    agent.queue.add(new StepAction());
    agent.queue.add(new WaitAction(agent.type.weight * 2));
  }
}
