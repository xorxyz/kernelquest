import { Agent } from './agent';

/** @category Capability */
export abstract class Capability {
  abstract bootstrap (agent: Agent): void
  abstract run (agent: Agent, tick: number): void
}
