import Clock from 'xor4-lib/clock';
import { debug } from 'xor4-lib/logging';
import { EventEmitter } from 'events';
import { World } from './world';
import { demoRoom } from '../lib/places';
import { CLOCK_MS_DELAY } from '../constants';

export interface EngineOptions {
  world?: World
  rate?: number
}

export interface IWaitCallback {
  tick: number
  fn: Function
}

export class Engine extends EventEmitter {
  cycle: number = 0;
  world: World;
  elapsed: number = 0;
  readonly clock: Clock;

  constructor(opts?: EngineOptions) {
    super();
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = opts?.world || new World([demoRoom]);

    this.clock.on('tick', this.update.bind(this));
  }

  update() {
    this.emit('begin-turn');
    this.cycle++;

    this.world.places.forEach((place) => place.update(this.cycle));

    this.emit('end-turn');
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