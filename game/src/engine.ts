import { Clock, CLOCK_MS_DELAY, debug } from 'xor4-lib';
import { EventEmitter } from 'events';
import { World } from './world';
import { Place } from './place';
import { Spirit } from '../lib';
import { Agent } from './agent';

const defaultPlace = new Place(0, 0);

/** @category Engine */
export interface EngineOptions {
  world?: World
  rate?: number
}

/** @category Engine */
export interface IWaitCallback {
  tick: number
  fn: Function
}

/** @category Engine */
export class Engine extends EventEmitter {
  cycle: number = 0;
  world: World;
  heroes: Array<Agent>;
  elapsed: number = 0;
  readonly clock: Clock;

  constructor(opts?: EngineOptions) {
    super();

    const spirit = new Agent(new Spirit());

    spirit.name = 'me';

    defaultPlace.put(spirit);

    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = opts?.world || new World([defaultPlace]);
    this.heroes = [spirit];

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
    this.world.places.forEach((place) => place.events.emit('start'));
    debug('started engine.');
  }

  pause() {
    this.clock.pause();
    this.world.places.forEach((place) => place.events.emit('pause'));
    debug('paused engine.');
  }
}
