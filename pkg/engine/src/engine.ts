import { EventEmitter } from 'events';
import Clock from './clock';
import { 
  Component, Entity, GameSystem, SystemComponents, SystemComponentMap
} from '../lib/ecs';

const DEFAUT_CLOCK_RATE = 2

export interface EngineOptions {
  rate?: number
}

export default class Engine extends EventEmitter {
  private clock: Clock
  private frame: number = 0

  private entities: Array<Entity> = []
  private components: Array<Component> = []
  private systems: Array<GameSystem>

  private systemComponents: SystemComponentMap = new Map()
  private queue: Array<object> = [];

  constructor(opts: EngineOptions, systems: Array<GameSystem>) {
    super()

    this.clock = new Clock(opts.rate)
    this.systems = systems

    this.systems.forEach((system) => {
      const componentMap = this.componentsOf(system);
      this.systemComponents.set(system, componentMap);
    });

    this.clock.on('tick', this.update.bind(this));
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }

  get currentFrame () {
    return this.frame
  }

  update() {
    const frame = this.frame++

    this.systems.forEach((system) => {
      const components = this.systemComponents.get(system);

      if (!components) return;

      return system.update(frame);
    });
  }

  schedule (playerAction) {
    const frame = this.frame

    this.queue.push({ 
      frame, 
      ...playerAction
    })

    console.log('engine: got job to schedule:', playerAction)
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
