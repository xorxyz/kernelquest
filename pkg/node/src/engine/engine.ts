/*
 * the game engine
 */
import Clock from '../../lib/clock';
import { Actor } from './actors';
import { World } from './places';

const CLOCK_MS_DELAY = 500;

export interface EngineOptions {
  rate?: number
}

export default class Engine {
  actors: Array<Actor> = []

  public clock: Clock
  private world: World
  private round: number = 0

  constructor(opts?: EngineOptions) {
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = new World();

    this.clock.on('tick', this.update.bind(this));
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }

  update() {
    this.round++;
    this.actors.forEach((actor) => actor.takeTurn());
    // this.world.zones.forEach((zone) => {
    //   zone.rooms.forEach((room) => {
    //     room.actors.forEach((actor) => actor.takeTurn());
    //   });
    // });
  }
}
