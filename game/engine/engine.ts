/*
 * the game engine
 */
import Clock from '../lib/clock';
import { World } from './world/world';
import { Farmer, Sheep, Tutor } from './agents/agents';
import { Room, testRoom } from './world/rooms';
import { KeyItem } from './things/items';
import { Bug } from './agents/monsters';
import { Door, Lock, Wall, WallTop } from './things/things';

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

    const key = new KeyItem();

    const bug = new Bug(this);

    this.rooms[0].add(new Sheep(this), 14, 8);
    this.rooms[0].add(new Tutor(this), 7, 7);
    this.rooms[0].add(new Farmer(this), 0, 5);

    this.rooms[0].cells[4][7].stack.push(new Door());
    this.rooms[0].cells[5][7].stack.push(new Lock());

    this.rooms[0].add(bug, 5, 5);

    this.rooms[0].cells[1][1].stack.push(key);

    this.rooms[0].cells[0][5].stack.push(new WallTop());
    this.rooms[0].cells[0][6].stack.push(new WallTop());
    this.rooms[0].cells[0][7].stack.push(new WallTop());
    this.rooms[0].cells[0][8].stack.push(new WallTop());
    this.rooms[0].cells[0][8].stack.push(new WallTop());

    this.rooms[0].cells[1][5].stack.push(new Wall());
    this.rooms[0].cells[1][6].stack.push(new Wall());
    this.rooms[0].cells[1][7].stack.push(new Wall());
    this.rooms[0].cells[1][8].stack.push(new Wall());
    this.rooms[0].cells[1][8].stack.push(new Wall());

    this.rooms[0].cells[3][5].stack.push(new WallTop());
    this.rooms[0].cells[3][6].stack.push(new WallTop());

    this.rooms[0].cells[3][8].stack.push(new WallTop());
    this.rooms[0].cells[3][9].stack.push(new WallTop());

    this.rooms[0].cells[4][5].stack.push(new Wall());
    this.rooms[0].cells[4][6].stack.push(new Wall());

    this.rooms[0].cells[4][8].stack.push(new Wall());
    this.rooms[0].cells[4][9].stack.push(new Wall());

    this.rooms[0].cells[0][4].stack.push(new WallTop());
    this.rooms[0].cells[1][4].stack.push(new WallTop());
    this.rooms[0].cells[2][4].stack.push(new WallTop());
    this.rooms[0].cells[3][4].stack.push(new WallTop());
    this.rooms[0].cells[4][4].stack.push(new Wall());

    this.rooms[0].cells[0][9].stack.push(new WallTop());
    this.rooms[0].cells[1][9].stack.push(new WallTop());
    this.rooms[0].cells[2][9].stack.push(new WallTop());
    this.rooms[0].cells[3][9].stack.push(new WallTop());
    this.rooms[0].cells[4][9].stack.push(new Wall());

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
