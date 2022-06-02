import { Clock, CLOCK_MS_DELAY, debug, Direction, EAST, Vector } from 'xor4-lib';
import { EventEmitter } from 'events';
import { World } from './world';
import { Area } from './area';
import {
  Flag, King, Wind,
  Earth, Fire, Water, Crown, Shield, Stars, Skull, Key, Temple,
} from '../lib';
import { Agent } from './agent';
import { Thing } from './thing';

const defaultArea = new Area(0, 0);

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

    defaultArea.put(wind, new Vector(0, 0));
    defaultArea.put(water, new Vector(1, 0));
    defaultArea.put(earth, new Vector(2, 0));
    defaultArea.put(fire, new Vector(3, 0));

    defaultArea.put(temple, new Vector(0, 9));

    defaultArea.put(king, new Vector(1, 8));
    // defaultArea.put(dragon, new Vector(15, 9));
    // defaultArea.put(sheep, new Vector(3, 3));
    // defaultArea.put(spirit, new Vector(4, 3));
    // defaultArea.put(microbe, new Vector(14, 8));

    defaultArea.put(flag, new Vector(0, 8));
    defaultArea.put(crown, new Vector(1, 7));
    defaultArea.put(shield, new Vector(1, 9));
    defaultArea.put(stars, new Vector(4, 5));
    defaultArea.put(skull, new Vector(14, 7));
    defaultArea.put(key, new Vector(5, 3));

    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = opts?.world || new World([defaultArea]);
    this.heroes = [king];

    this.clock.on('tick', this.update.bind(this));
  }

  update() {
    this.emit('begin-turn');
    this.cycle++;

    this.world.areas.forEach((area) => area.update(this.cycle));

    this.emit('end-turn');
  }

  start() {
    this.clock.start();
    this.world.areas.forEach((area) => area.events.emit('start'));
    debug('started engine.');
  }

  pause() {
    this.clock.pause();
    this.world.areas.forEach((area) => area.events.emit('pause'));
    debug('paused engine.');
  }
}
