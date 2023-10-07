import { Vector } from "../shared/vector";

export const South = new Vector(0, 1);
export const West = new Vector(-1, 0);
export const North = new Vector(0, -1);
export const East = new Vector(1, 0);

export const Directions = [South, West, North, East] as const;

export type ZeroToThree = 0 | 1 | 2 | 3

export class Heading {
  private value: ZeroToThree = 0;

  get(): Vector {
    return Directions[this.value].clone();
  }

  left(): void {
    this.value = (this.value === 0 ? 3 : this.value - 1) as ZeroToThree;
  }

  right(): void {
    this.value = (this.value === 3 ? 0 : this.value + 1) as ZeroToThree;
  }
}

export type AgentType = 'wizard' | 'scroll' | 'door';

export class Agent {
  readonly id: number;
  readonly heading = new Heading();
  readonly position = new Vector();
  readonly type: AgentType;

  constructor(id: number, type: AgentType) {
    this.id = id;
    this.type = type;
  }

  describe (): string {
    return `It's a ${this.type}.`;
  }
}
