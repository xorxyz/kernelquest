import { Vector } from '../../../lib/math';
import { Stack } from '../../../lib/stack';
import { Agent } from '../agents/agents';
import { Item } from '../things/items';

export class Port {
  name: string
  constructor(name: string) {
    this.name = name;
  }
}

export const Ports = () => [
  new Port('n'), new Port('e'), new Port('s'), new Port('w'),
];

export class Cell {
  position: Vector
  bg: string
  stack: Stack<Item> = new Stack()
  ports: Array<Port> = Ports()
  agent: Agent | null = null

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
    this.bg = '..';
  }

  render() {
    return this.agent
      ? this.agent.look?.bytes || 'XX'
      : this.bg;
  }
}
