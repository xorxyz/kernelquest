/*
 * the game engine
 */
import * as EventEmitter from 'events';
import Clock from '../../lib/clock';
import { Vector } from '../../lib/math';
import { Actor, Critter, TutorNpc } from './actors';
import { GoldItem, Item } from './items';
import { World } from './places';

export const CLOCK_MS_DELAY = 300;

export interface EngineOptions {
  rate?: number
}

export default class Engine extends EventEmitter {
  actors: Array<Actor> = []
  items: Array<Item> = []
  clock: Clock

  private world: World
  private round: number = 0

  constructor(opts?: EngineOptions) {
    super();

    this.clock = new Clock(opts?.rate || CLOCK_MS_DELAY);
    this.world = new World();

    const gold = new GoldItem(3);
    gold.position.setXY(7, 7);
    this.items.push(gold);

    const sheep = new Critter();
    sheep.position.setXY(9, 5);
    this.actors.push(sheep);

    const tutor = new TutorNpc();
    tutor.position.setXY(9, 9);
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
      if (!this.actors.some((a) => a.position.equals(next))) {
        actor.position.copy(next);
      }

      actor.velocity.sub(actor.velocity);

      /* --- power ups --- */
      this.items.forEach((item) => {
        if (actor.position.equals(item.position)) {
          if (item instanceof GoldItem) {
            actor.wealth.increase(item.amount);
          } else {
            actor.items.push(item);
          }
          this.items.splice(this.items.findIndex((i) => i === item));
        }
      });
    });
  }
}
