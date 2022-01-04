import { Stack } from 'xor4-lib/stack';
import { Thing } from './things';
import { Agent } from './agents';
import { Room } from './room';
import { ROOM_HEIGHT, ROOM_WIDTH } from '../constants';

export type Memory = Array<Thing>
export type DataStack = Stack<Thing>

export class World {
  readonly rooms: Array<Room>;

  constructor() {
    this.rooms = new Array(ROOM_WIDTH * ROOM_HEIGHT).fill(0).map((_, i) => {
      const y = Math.floor(i / ROOM_WIDTH);
      const x = y * ROOM_WIDTH + (ROOM_WIDTH - 1);
      return new Room(x, y);
    });
  }

  find(agent: Agent): Room | null {
    return this.rooms.find((room) => room.has(agent)) || null;
  }

  clear() {
    this.rooms.forEach((room) => room.clear());
  }
}
