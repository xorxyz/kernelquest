/*
 * the game engine
 */
import * as EventEmitter from 'events';
import Clock from '../../lib/clock';
import { Vector } from '../../lib/math';
import { World } from './world/world';
import { Agent, Sheep, Tutor } from './agents/agents';
import { GoldItem, Item, Wall } from './things/items';
import { Drop, PickUp } from './agents/commands';

export const CLOCK_MS_DELAY = 300;

export interface EngineOptions {
  rate?: number
}

export default class Engine extends EventEmitter {
  actors: Array<Agent> = []
  items: Array<Item> = []
  walls: Array<Wall> = []
  clock: Clock

  private world: World
  private round: number = 0

  constructor(opts?: EngineOptions) {
    super();

    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = new World();

    const gold = new GoldItem(3);
    gold.position.setXY(8, 8);
    this.items.push(gold);

    const sheep = new Sheep();
    sheep.position.setXY(9, 9);
    this.actors.push(sheep);

    const tutor = new Tutor();
    tutor.position.setXY(7, 7);
    this.actors.push(tutor);

    this.clock.on('tick', this.update.bind(this));
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }

  update() {
    this.round++;
    this.actors.forEach((actor) => {
      const command = actor.takeTurn();

      if (command) command.execute(actor, this);

      /* --- movement --- */

      const next = new Vector(
        Math.min(Math.max(0, actor.position.x + actor.velocity.x), 9),
        Math.min(Math.max(0, actor.position.y + actor.velocity.y), 9),
      );

      // if there's no one there
      if (!this.walls.some((w) => w.position.equals(next)) &&
          !this.actors.some((a) => a.position.equals(next))) {
        actor.position.copy(next);
      }

      actor.velocity.sub(actor.velocity);

      /* --- power ups --- */

      if (command instanceof Drop) {
        command.item.position.setXY(actor.position.x, actor.position.y);
        command.execute(this.items);
      }

      if (command instanceof PickUp) {
        this.items.forEach((item) => {
          if (command.position.equals(item.position)) {
            actor.stack.push(item);
            this.items.splice(this.items.findIndex((i) => i === item));
          }
        });
      }

      // this.items.forEach((item) => {
      //   if (actor.position.equals(item.position)) {
      //     if (item instanceof GoldItem) {
      //       actor.wealth.increase(item.amount);
      //     } else {
      //       actor.items.push(item);
      //     }
      //     this.items.splice(this.items.findIndex((i) => i === item));
      //   }
      // });
    });
  }
}
