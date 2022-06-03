import { Stack, Vector } from 'xor4-lib';
import { Dictionary, Factor } from 'xor4-interpreter';
import { Thing } from './thing';
import { Agent, IAgentPoints, IFacing } from './agent';
import { Area } from './area';
import { Action, IAction } from './action';
import { Observation } from './mind';

/** @category World */
export type Memory = Array<Thing>

/** @category World */
export type DataStack = Stack<Thing>

export interface Position {
  area: Vector,
  cell: Vector,
  facing: IFacing
}

/** @category World */
export interface IWorldState {
  history: Array<IAction>,
  bodies: Record<string, string>,

  points: Record<string, IAgentPoints>,
  positions: Record<string, Position>,
  queues: Record<string, Array<Action>>,
  stacks: Record<string, Array<Factor>>,
  memory: Record<string, Array<Observation>>
  dicts: Record<string, Dictionary>
}

/** @category World */
export class World {
  public areas: Array<Area>;
  private agents: Set<Agent>;
  private things: Set<Thing>;
  private state: IWorldState = {
    history: [],
    bodies: {},
    points: {},
    positions: {},
    queues: {},
    stacks: {},
    memory: {},
    dicts: {},
  };

  constructor(areas: Array<Area>) {
    this.areas = [...areas];
  }

  find(agent: Agent): Area | null {
    return this.areas.find((area) => area.has(agent)) || null;
  }

  clear() {
    this.areas.forEach((area) => area.clear());
  }

  deserialize(str: string) {
    Object.assign(this.state, JSON.parse(str));
  }

  serialize() {
    return JSON.stringify(this.state);
  }
}
