import { esc, Style } from '../../../lib/esc';
import { Vector } from '../../../lib/math';
import { Stack } from '../../../lib/stack';
import { Agent } from '../agents/agents';
import { Thing } from '../things/things';

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
  agent: Agent | null = null
  stack: Stack<Thing> = new Stack()
  ports: Array<Port> = Ports()

  constructor(x: number, y: number) {
    this.position = new Vector(x, y);
    this.bg = `${esc(Style.Dim)}..${esc(Style.Reset)}`;
  }

  render() {
    return this.agent
      ? this.agent.look?.bytes || 'XX'
      : this.stack.peek()?.look.bytes || this.bg;
  }
}
