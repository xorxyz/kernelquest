/*
 * the game engine
 */
import Clock from '../../lib/clock';
import { Vector } from '../../lib/math';
import { World } from './world/world';
import { Agent, Sheep, Tutor } from './agents/agents';
import { GoldItem, Item } from './things/items';
import { Drop, PickUp } from './agents/commands';
import { Wall } from './things/blocks';
import { Room, testRoom } from './world/rooms';

export const CLOCK_MS_DELAY = 300;

export interface EngineOptions {
  rate?: number
}

export default class Engine {
  agents: Array<Agent> = []
  items: Array<Item> = []
  walls: Array<Wall> = []
  clock: Clock
  room: Room = testRoom

  private world: World
  private round: number = 0

  constructor(opts?: EngineOptions) {
    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = new World();

    const gold = new GoldItem(3);
    gold.position.setXY(8, 8);
    this.items.push(gold);

    const sheep = new Sheep(this);
    this.room.add(sheep, 9, 9);

    const tutor = new Tutor(this);
    this.room.add(tutor, 7, 7);

    this.clock.on('tick', this.update.bind(this));
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }

  update() {
    this.round++;
    this.room.agents.forEach((agent) => {
      const command = agent.takeTurn();

      if (command) command.execute(agent, this);

      /* --- movement --- */

      const next = new Vector(
        Math.min(Math.max(0, agent.position.x + agent.velocity.x), 15),
        Math.min(Math.max(0, agent.position.y + agent.velocity.y), 9),
      );

      // if there's no one there
      if (!this.walls.some((w) => w.position.equals(next)) &&
          !this.agents.some((a) => a.position.equals(next))) {
        this.room.move(agent, next.x, next.y);
      }

      agent.velocity.sub(agent.velocity);

      /* --- items --- */
      if (command instanceof Drop) {
        command.item.position.setXY(agent.position.x, agent.position.y);
        command.execute(this.items);
      }

      if (command instanceof PickUp) {
        this.items.forEach((item) => {
          if (command.position.equals(item.position)) {
            agent.stack.push(item);
            this.items.splice(this.items.findIndex((i) => i === item));
          }
        });
      }
    });
  }
}
