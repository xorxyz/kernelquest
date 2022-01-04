import { getRandom } from 'xor4-lib/math';
import { Queue } from 'xor4-lib/queue';
import { Action, RotateAction, StepAction } from '../engine/actions';
import { Capability } from '../engine/agents';

export class RandomWalkCapability extends Capability {
  delayMs: number;
  timer;

  constructor(delayMs: number = 2000) {
    super();
    this.delayMs = delayMs;
  }

  bootstrap(queue: Queue<Action>) {
    this.timer = setInterval(() => {
      let n = getRandom(0, 3);

      while (n >= 0) {
        queue.push(new RotateAction());
        n--;
      }

      queue.push(new StepAction());
    }, this.delayMs);
  }
}
