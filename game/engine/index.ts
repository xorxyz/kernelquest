import Clock from 'xor4-lib/clock';
import { debug } from 'xor4-lib/logging';
import { World } from './world';
import { CLOCK_MS_DELAY } from '../constants';
import { Agent } from './agents';

export interface EngineOptions {
  world?: World
  rate?: number
}

export class Engine {
  cycle: number = 0;
  world: World;
  readonly clock: Clock;

  constructor(opts?: EngineOptions) {
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = opts?.world || new World();
    debug('creating engine');

    this.clock.on('tick', this.update.bind(this));
  }

  update() {
    this.cycle++;

    this.world.rooms.forEach((room) => {
      room.cells.forEach((cell) => {
        cell.update();
        cell.owner = null;
      });

      room.agents.forEach((agent: Agent) => {
        if (!agent.room) return;

        const action = agent.takeTurn(this.cycle);

        if (action && action.authorize(agent)) {
          action.perform(room, agent);
        } else {
          agent.sp.increase(1);
        }

        agent.room.move(agent);

        const cell = room.cellAt(agent.position.clone().add(agent.direction));
        if (cell) {
          cell.owner = agent;
        }
      });
    });
  }

  start() {
    this.clock.start();
    debug('started engine.');
  }
  pause() {
    this.clock.pause();
    debug('paused engine.');
  }
}
