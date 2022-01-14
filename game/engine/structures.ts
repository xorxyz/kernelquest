import { Rectangle, Vector } from 'xor4-lib/math';
import { Agent } from './agents';
import { Cell } from './cell';
import { Thing } from './things';

export class Structure {
  public position: Vector;
  public rect: Rectangle;
  public cells: Array<Cell>;
  private owner: Agent;

  constructor(owner: Agent) {
    this.owner = owner;
  }

  get things(): Array<Thing> {
    const things = this.cells
      .filter((cell) => cell.slot && cell.slot instanceof Thing)
      .map((cell) => cell.slot) as Array<Thing>;

    return things;
  }

  get agents(): Array<Agent> {
    const agents = this.cells
      .filter((cell) => cell.slot && cell.slot instanceof Agent)
      .map((cell) => cell.slot) as Array<Agent>;

    return agents;
  }
}
