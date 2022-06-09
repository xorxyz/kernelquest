import { Stack, Vector } from 'xor4-lib';
import { Area } from './area';
import { IThing, Thing } from './thing';
import { Agent, IAgent, IFacing } from './agent';
import { IAction } from './action';

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
  agents: Array<IAgent>,
  things: Array<IThing>,
  positions: Record<string, Position>,
}

export interface IWorld {
  state: IWorldState
}

/** @category World */
export class World {
  public tick: number = 0;
  public areas: Array<Area>;
  private agents: Set<Agent> = new Set();
  private things: Set<Thing> = new Set();
  private state: IWorldState = {
    history: [],
    agents: [],
    things: [],
    positions: {},
  };

  constructor(areas: Array<Area>) {
    this.areas = [...areas];
  }

  static from(serialized: IWorld): World {
    return new World([]);
  }

  serialize(): IWorld {
    return {
      state: this.state,
    };
  }

  find(agent: Agent): Area | null {
    return this.areas.find((area) => area.has(agent)) || null;
  }

  clear() {
    this.areas.forEach((area) => area.clear());
  }
}
