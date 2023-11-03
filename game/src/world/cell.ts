import { Vector } from '../shared/vector';
import { Agent } from './agent';

export type LayerName = 'lower' | 'middle' | 'upper'

export class Cell {
  readonly position: Vector;

  private layers = new Map<LayerName, null | Agent>();

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
  }

  get(layer: LayerName = 'middle'): Agent | null {
    return this.layers.get(layer) || null;
  }

  put(layer: LayerName, agent: Agent): void {
    if (this.layers.get(layer)) throw new Error('There is already something here.');
    this.layers.set(layer, agent);
  }

  remove(id: number): void {
    [...this.layers.entries()].forEach(([key, agent]) => {
      if (agent?.id === id) {
        this.layers.set(key, null);
      }
    });
  }

  contains(id: number): boolean {
    return [...this.layers.values()].some(agent => agent?.id === id);
  }

  find(id: number): LayerName[] {
    const layer = [...this.layers.entries()]
      .filter(([_, agent]) => agent?.id === id)
      .map(([key]) => key);

    if (!layer.length) throw new Error(`Entity &${id} is not in cell ${this.position.label}`);

    return layer;
  }

  render(): string {
    return  this.get('middle')?.render() ?? '..'
  }
}
