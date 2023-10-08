import { Agent } from '../world/agent';
import { Cell } from '../world/cell';
import { Vector } from './vector';

const AREA_WIDTH = 16;
const AREA_HEIGHT = 10;

export class Area {
  id: number;

  cells: Cell[];

  constructor(id: number) {
    this.id = id;
    this.cells = new Array(AREA_WIDTH * AREA_HEIGHT).fill(0).map((_, n) => {
      const y = Math.floor(n / AREA_WIDTH);
      const x = n - (y * AREA_WIDTH);
      return new Cell(x, y);
    });
  }

  cellAt(v: Vector): Cell {
    const cell = this.cells.find((c) => c.position.equals(v));
    if (!cell) throw new Error(`There is no cell at ${v.label}.`);
    return cell;
  }

  contains(id: number): boolean {
    return this.cells.some((cell) => cell.contains(id));
  }

  find(id: number): Cell {
    const cell = this.cells.find((c) => c.contains(id));
    if (!cell) throw new Error(`There is entity &${id} in this area.`);
    return cell;
  }

  move(agent: Agent, destination: Vector): void {
    const targetCell = this.cellAt(destination);
    const sourceCell = this.find(agent.id);

    targetCell.put('middle', agent.id);
    sourceCell.remove(agent.id);    

    agent.position.copy(destination);
  }

  put(position: Vector, agent: Agent): void {
    const cell = this.cellAt(position);
    cell.put('middle', agent.id);

    agent.position.copy(position);
  }
}
