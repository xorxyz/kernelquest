import { getRandom } from 'xor4-lib/math';
import { forN } from 'xor4-lib/utils';
import { RotateAction, StepAction, WaitAction } from './actions';
import { Agent, Capability } from '../engine/agents';

export class RandomWalkCapability extends Capability {
  bootstrap() {}

  run(agent: Agent, tick: number) {
    if (agent.queue.length !== 0 || tick % 10 !== 0) return;
    const n = getRandom(0, 3) as 0 | 1 | 2 | 3;

    if (n) {
      forN(n, () => {
        agent.queue.push(new RotateAction());
        agent.queue.push(new WaitAction(agent.type.weight * 2));
      });
    }

    agent.queue.push(new StepAction());
    agent.queue.push(new WaitAction(agent.type.weight * 2));
  }
}
