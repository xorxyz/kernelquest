import { getRandom } from 'xor4-lib/math';
import { forN } from 'xor4-lib/utils';
import { RotateAction, StepAction } from '../engine/actions';
import { Agent, Capability } from '../engine/agents';

export class RandomWalkCapability extends Capability {
  delayMs: number;

  constructor(delayMs: number = 10) {
    super();
    this.delayMs = delayMs;
  }

  bootstrap() {}

  run(agent: Agent, tick: number) {
    if (tick % this.delayMs !== 0) return;

    const n = getRandom(0, 3) as 0 | 1 | 2 | 3;

    forN(n, () => agent.queue.push(new RotateAction(n)));

    agent.queue.push(new StepAction());
  }
}
