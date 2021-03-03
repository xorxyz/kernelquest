/*
 * the game engine
 */
import Clock from '../../lib/clock';
import { World } from './world/world';
import { Sheep, Tutor } from './agents/agents';
import { Room, testRoom } from './world/rooms';

export const CLOCK_MS_DELAY = 60;

export interface EngineOptions {
  rate?: number
}

export default class Engine {
  clock: Clock
  rooms: Array<Room> = [testRoom]

  private world: World
  private round: number = 0

  constructor(opts?: EngineOptions) {
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = new World();

    const sheep = new Sheep(this);
    const tutor = new Tutor(this);

    this.rooms[0].add(sheep, 15, 9);
    this.rooms[0].add(tutor, 7, 7);

    this.clock.on('tick', this.update.bind(this));
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }

  update() {
    this.round++;
    this.rooms.forEach((room) => {
      room.update(this.round);
    });
  }
}
