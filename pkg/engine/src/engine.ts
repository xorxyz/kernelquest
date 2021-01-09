import { EventEmitter } from 'events';
import Clock from './clock';
import { 
  Component, Entity, GameSystem, SystemComponents, SystemComponentMap, IPlayerCommand
} from './ecs';

const DEFAUT_CLOCK_RATE = 2

export interface EngineOptions {
  rate?: number
}

export default class Engine extends EventEmitter {
  private clock: Clock
  private frame: number = 0

  private entities: Array<Entity> = []
  private components: Array<Component> = []
  private systems: Array<GameSystem> = []

  private queue: Array<IPlayerCommand> = [];

  constructor(opts: EngineOptions) {
    super()

    this.clock = new Clock(opts.rate);

    this.clock.on('tick', this.update.bind(this));
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }

  get currentFrame () {
    return this.frame
  }

  update() {
    const frame = this.frame++
    const queue = this.queue.filter(action => action?.frame === frame)

    this.systems.forEach((system) => {
      return system.update(frame, queue);
    });
  }

  scheduleCommand (command: IPlayerCommand) {
    const frame = this.frame

    if (command.frame !== frame) return false

    console.log('engine: got player command to schedule:', command)

    this.queue.push(command)

    return true
  }

  register (gameSystem: GameSystem) {
    this.systems.push(gameSystem)
  }

  componentsOf(gameSystem: GameSystem): SystemComponents {
    const components: SystemComponents = new Map();

    gameSystem.componentTypes.forEach((type) => {
      components.set(type, this.components.filter((component) => {
        return component.type === type;
      }));
    });

    return components;
  }

  create(components: Array<Component>) {
    const entity = new Entity(components);

    this.entities.push(entity);
  }

  destroy(id) {
    this.entities.find((e) => e.id === id);
  }
}
