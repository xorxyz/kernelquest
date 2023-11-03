import { Queue } from "../shared/queue";
import { Vector } from "../shared/vector";
import { EveryAction } from "./actions";

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

export type AgentType = 'wizard' | 'man' | 'wall' | 'scroll' | 'flag';

export const glyphs: Record<AgentType, string> = {
  wizard: '🧙',
  flag: '🚩 ',
  man: '👨',
  scroll: '📜',
  wall: '##'
};

export class Agent {
  readonly id: number;
  readonly heading = new Heading();
  readonly position = new Vector();
  readonly type: AgentType;
  private hands: Agent | null = null;
  private queue: Queue<EveryAction> = new Queue();

  constructor(id: number, type: AgentType) {
    this.id = id;
    this.type = type;
  }

  describe (): string {
    return `It's a ${this.type}.`;
  }

  holding() {
    return this.hands?.id || 0;
  }

  get(agent: Agent) {
    this.hands = agent;
  }

  put(): Agent | null {
    const agent = this.hands;
    this.hands = null;
    return agent;
  }

  facing (): Vector {
    return this.position.clone().add(this.heading.get());
  }

  do (action: EveryAction) {
    this.queue.add(action);
  }

  render() {
    return glyphs[this.type];
  }
}

export class Scroll extends Agent {
  private text = '';

  constructor(id: number) {
    super(id, 'scroll');
  }

  read(): string {
    return this.text;
  }

  write(text: string): void {
    this.text = text;
  }
  
  execute(agent: Agent): void {
    agent.do({
      name: 'sh',
      args: {
        text: this.text
      }
    })
  }
}

export class Flag extends Agent {
  constructor(id: number) {
    super(id, 'flag');
  }
}

export class Man extends Agent {
  constructor(id: number) {
    super(id, 'man');
  }
}

export class Wall extends Agent {
  constructor(id: number) {
    super(id, 'wall');
  }
}
