import { EventEmitter } from 'events';
import Clock from './clock';
import * as ecs from './ecs';

import createWorldEntity from '../lib/entities/world';
import createZoneEntity from '../lib/entities/zone';
import createPlayerEntity from '../lib/entities/player';

const DEFAUT_CLOCK_RATE = 1 / 2;

export interface EngineOptions {
  rate?: number
}

export default class Engine extends EventEmitter {
  private clock: Clock
  private frame: number = 0

  private entities: Array<ecs.Entity> = []
  private systems: Array<ecs.GameSystem> = []

  private commandQueue: Array<ecs.IPlayerCommand> = [];

  constructor(opts: EngineOptions) {
    super();

    this.clock = new Clock(opts.rate || DEFAUT_CLOCK_RATE);

    this.clock.on('tick', this.update.bind(this));

    this.reset();
  }

  reset() {
    this.clock.pause();
    this.clock.reset();

    this.entities.length = 0;
    this.systems.length = 0;

    this.commandQueue.length = 0;

    this.create(createWorldEntity);
    this.create(createZoneEntity);
    this.create(createPlayerEntity);
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }

  get currentFrame() {
    return this.frame;
  }

  update() {
    console.log('tick');
    this.loadEntities();

    const queue = this.commandQueue.filter((c) => c?.frame === this.frame);
    const frame = this.frame++;

    this.systems.forEach((system) => {
      try {
        system.update(frame, queue);
      } catch (err) {
        console.error('system error', system, err);
      }
    });
  }

  findEntities(types: Array<string>) {
    return this.entities.filter((e) => types.some((type) => e.components.has(type)));
  }

  loadEntities() {
    this.systems.forEach((system) => system.load(this.entities));
  }

  scheduleCommand(command: ecs.IPlayerCommand) {
    if (command.frame !== this.frame) return false;

    this.commandQueue.push(command);

    return true;
  }

  register(gameSystem: ecs.GameSystem) {
    this.systems.push(gameSystem);
  }

  create(factoryFn: () => ecs.Entity) {
    const entity = factoryFn();

    this.entities.push(entity);
  }

  destroy(id) {
    this.entities.find((e) => e.id === id);
  }
}
