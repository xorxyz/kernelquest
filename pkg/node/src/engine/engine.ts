/*
 * the game engine
 */
import Clock from '../../lib/clock';
import { World } from './places';

const DEFAUT_CLOCK_RATE = 1 / 2;

export interface EngineOptions {
  rate?: number
}

export default class Engine {
  private clock: Clock
  private world: World
  private frame: number = 0

  constructor(opts: EngineOptions) {
    this.clock = new Clock(opts.rate || DEFAUT_CLOCK_RATE);
    this.world = new World();

    this.clock.on('tick', this.update.bind(this));
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }

  get currentFrame() {
    return this.frame;
  }

  update() {
    this.world.zones.forEach((zone) => {
      zone.rooms.forEach((room) => {
        room.actors.forEach((actor) => actor.takeTurn());
      });
    });
  }
}
