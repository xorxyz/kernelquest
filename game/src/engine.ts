import { Clock, CLOCK_MS_DELAY, debug, Vector, West } from 'xor4-lib';
import { EventEmitter } from 'events';
import { World } from './world';
import { Place } from './place';
import { Dragon, Earth, Fire, King, Wind } from '../lib';
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

    const king = new Agent(new King());

    king.name = 'me';

    // const wind = new Agent(new Wind());
    // const earth = new Agent(new Earth());
    // const fire = new Agent(new Fire());

    defaultPlace.put(king, new Vector(0, 0));
    // defaultPlace.put(wind, new Vector(2, 1));
    // defaultPlace.put(earth, new Vector(3, 1));
    // defaultPlace.put(fire, new Vector(4, 1));

    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = opts?.world || new World([defaultPlace]);
    this.heroes = [king];

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
