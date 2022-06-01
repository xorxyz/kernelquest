import { Clock, CLOCK_MS_DELAY, debug, Direction, EAST, East, Vector } from 'xor4-lib';
import { EventEmitter } from 'events';
import { World } from './world';
import { Place } from './place';
import {
  Dragon, Flag, King, Wind, Spirit, Sheep,
  Microbe, Earth, Fire, Water, Crown, Shield, Stars, Skull, Key, Temple,
} from '../lib';
import { Agent } from './agent';
import { Thing } from './thing';

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
    const wind = new Agent(new Wind());
    // const dragon = new Agent(new Dragon());
    // const sheep = new Agent(new Sheep());
    // const spirit = new Agent(new Spirit());
    // const microbe = new Agent(new Microbe());
    const temple = new Thing(new Temple());

    const flag = new Thing(new Flag());
    const crown = new Thing(new Crown());
    const shield = new Thing(new Shield());
    const stars = new Thing(new Stars());
    const skull = new Thing(new Skull());
    const key = new Thing(new Key());

    king.name = 'me';

    const water = new Agent(new Water());
    const earth = new Agent(new Earth());
    const fire = new Agent(new Fire());

    wind.facing.direction = new Direction(EAST);
    water.facing.direction = new Direction(EAST);
    earth.facing.direction = new Direction(EAST);
    fire.facing.direction = new Direction(EAST);

    defaultPlace.put(wind, new Vector(0, 0));
    defaultPlace.put(water, new Vector(1, 0));
    defaultPlace.put(earth, new Vector(2, 0));
    defaultPlace.put(fire, new Vector(3, 0));

    defaultPlace.put(temple, new Vector(0, 9));

    defaultPlace.put(king, new Vector(1, 8));
    // defaultPlace.put(dragon, new Vector(15, 9));
    // defaultPlace.put(sheep, new Vector(3, 3));
    // defaultPlace.put(spirit, new Vector(4, 3));
    // defaultPlace.put(microbe, new Vector(14, 8));

    defaultPlace.put(flag, new Vector(0, 8));
    defaultPlace.put(crown, new Vector(1, 7));
    defaultPlace.put(shield, new Vector(1, 9));
    defaultPlace.put(stars, new Vector(4, 5));
    defaultPlace.put(skull, new Vector(14, 7));
    defaultPlace.put(key, new Vector(5, 3));

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
