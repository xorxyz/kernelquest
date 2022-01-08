import Clock from 'xor4-lib/clock';
import { debug } from 'xor4-lib/logging';
import { World } from './world';
import { CLOCK_MS_DELAY } from '../constants';

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

    this.world.rooms.forEach((room) => room.update(this.cycle));
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
