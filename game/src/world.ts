import { Stack, Vector } from 'xor4-lib';
import { Area } from './area';
import { Thing } from './thing';
import { Agent, AgentType, Hero, IFacing } from './agent';
import { Bug, King } from '../lib/agents';
import words from '../lib/words';

/** @category World */
export type Memory = Array<Thing>

/** @category World */
export type DataStack = Stack<Thing>

export interface Position {
  area: Vector,
  cell: Vector,
  facing: IFacing
}

export type AgentTypeName = 'king' | 'bug'

export const AgentTypeDict: Record<AgentTypeName, new () => AgentType> = {
  king: King,
  bug: Bug,
};

/** @category World */
export class World {
  public tick: number = 0;
  public areas: Array<Area>;
  public agents: Set<Agent> = new Set();
  public things: Set<Thing> = new Set();
  public origin = new Area(0, 0);
  public creator: Agent;
  public hero: Agent;
  public counter = 0;

  constructor(areas: Array<Area> = []) {
    this.areas = [this.origin, ...areas];
    this.creator = this.spawn('king', this.origin);
    this.hero = this.creator;
  }

  spawn(agentType: AgentTypeName, area: Area, position?: Vector) {
    const AgentTypeCtor = AgentTypeDict[agentType];
    const agent = new Agent(this.counter++, new AgentTypeCtor(), words);
    this.agents.add(agent);
    area.put(agent, position);
    return agent;
  }

  find(agent: Agent): Area | null {
    return this.areas.find((area) => area.has(agent)) || null;
  }

  clear() {
    this.areas.forEach((area) => area.clear());
  }
}
