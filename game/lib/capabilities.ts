import { getRandom, forN } from 'xor4-lib';
import { Agent } from '../src/agent';
import { Capability } from '../src/action';
import { RotateAction, StepAction, WaitAction } from './actions';

/** @category Capabilities */
export class RandomWalkCapability extends Capability {
  bootstrap() {}

  run(agent: Agent, tick: number) {
    if (agent.mind.queue.size !== 0 || tick % 10 !== 0) return;
    const n = getRandom(0, 3) as 0 | 1 | 2 | 3;

    if (n) {
      forN(n, () => {
        agent.mind.queue.add(new RotateAction());
        agent.mind.queue.add(new WaitAction(12));
      });
    }
    agent.mind.queue.add(new StepAction());
    agent.mind.queue.add(new WaitAction(12));
  }
}

/** @category Capabilities */
export class TemperatureCapability extends Capability {
  temperature = 10;

  bootstrap() {}

  run(agent: Agent, tick: number) {
    if (this.temperature > 0) {
      agent.velocity.add(agent.facing.direction.value);
      this.temperature--;
    }
  }
}
