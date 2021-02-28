/*
 * the game engine
 */
import Clock from '../../lib/clock';
import { World } from './world/world';
import { Sheep, Tutor } from './agents/agents';
import { GoldItem } from './things/items';
import { Drop, Move, PickUp } from './agents/commands';
import { Room, testRoom } from './world/rooms';

export const CLOCK_MS_DELAY = 60;

export interface EngineOptions {
  rate?: number
}

export default class Engine {
  clock: Clock
  room: Room = testRoom

  private world: World
  private round: number = 0

  constructor(opts?: EngineOptions) {
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = new World();

    const gold = new GoldItem(3);
    gold.position.setXY(8, 8);
    this.room.items.push(gold);

    const sheep = new Sheep(this);
    this.room.add(sheep, 15, 9);

    const tutor = new Tutor(this);
    this.room.add(tutor, 7, 7);

    this.clock.on('tick', this.update.bind(this));
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }

  update() {
    this.round++;
    this.room.agents.forEach((agent) => {
      if (!agent.queue.length) return;

      const command = agent.takeTurn();

      if (command instanceof Move) {
        command.execute(agent);
      }

      const { nextPosition } = agent;

      if (!this.room.collides(nextPosition)) {
        this.room.move(agent, nextPosition.x, nextPosition.y);
      }

      agent.velocity.sub(agent.velocity);

      if (command instanceof Drop) {
        command.item.position.setXY(agent.position.x, agent.position.y);
        command.execute(agent, this.room.items);
      }

      if (command instanceof PickUp) {
        this.room.items.forEach((item) => {
          if (command.position.equals(item.position)) {
            agent.stack.push(item);
            this.room.items.splice(this.room.items.findIndex((i) => i === item));
          }
        });
      }
    });
  }
}
