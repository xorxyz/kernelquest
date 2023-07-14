import { Agent } from './shared/agent';

export class EntityManager {
  private idCounter = 0;
  private agents: Set<Agent> = new Set();
}
