/*
 * the game engine
 */
import * as EventEmitter from 'events';
import Clock from '../../lib/clock';
import { Actor, Critter } from './actors';
import { World } from './places';

const CLOCK_MS_DELAY = 300;

export interface EngineOptions {
  rate?: number
}

export default class Engine extends EventEmitter {
  actors: Array<Actor> = []

  public clock: Clock
  private world: World
  private round: number = 0

  constructor(opts?: EngineOptions) {
    super();

    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = new World();

    const sheep = new Critter();
    sheep.position.setXY(9, 5);
    this.actors.push(sheep);

    this.clock.on('tick', this.update.bind(this));
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }

  update() {
    this.round++;
    this.actors.forEach((actor) => {
      if (actor.takeTurn()) {
        this.emit('render');
      }
    });
  }
}
