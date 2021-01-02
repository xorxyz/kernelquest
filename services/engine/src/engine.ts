import Clock from './clock';
import { Entity, GameSystem } from './core/classes';
import { IComponent } from './core/interfaces';
import { ComponentMap, SystemComponentMap } from './core/types';
import movementSystem from './systems/movement';

export default class Engine {
  private clock: Clock = new Clock()

  private entities: Array<Entity> = []
  private components: Array<IComponent> = []
  private systems: Array<GameSystem> = [movementSystem]

  private systemComponents: SystemComponentMap = new Map()

  constructor() {
    this.clock.on('tick', this.update.bind(this));

    this.systems.forEach((system) => {
      const componentMap = this.componentsOf(system);
      this.systemComponents.set(system, componentMap);
    });
  }

  start() { this.clock.start(); }
  pause() { this.clock.pause(); }

  componentsOf(gameSystem: GameSystem): ComponentMap {
    const components: Map<string, Array<IComponent>> = new Map();

    gameSystem.componentTypes.forEach((type) => {
      components.set(type, this.components.filter((component) => {
        return component.type === type;
      }));
    });

    return components;
  }

  create(components: Array<IComponent>) {
    const entity = new Entity(components);

    this.entities.push(entity);
  }

  update() {
    this.systems.forEach((system) => {
      const componentMap = this.systemComponents.get(system);
      if (!componentMap) {
        console.error('missing components for system:', system);
        return false;
      }

      return system.update(componentMap);
    });
  }

  destroy(id) {
    this.entities.find((e) => e.id === id);
  }
}
