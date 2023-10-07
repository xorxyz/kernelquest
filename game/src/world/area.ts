import { Vector } from "../shared/vector"
import { Agent } from "./agent"
import { Cell, LayerName } from './cell';

interface AgentData {
  position: Vector
}

const AREA_WIDTH = 16;
const AREA_HEIGHT = 10;

export class Area {
  id: number;

  agents = new Map<Agent, AgentData>();

  cells: Cell[];

  constructor(id: number) {
    this.id = id;
    this.cells = new Array(AREA_WIDTH * AREA_HEIGHT).fill(0).map((_, n) => {
      const y = Math.floor(n / AREA_WIDTH);
      const x = n - (y * AREA_WIDTH) - 1;
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
    if (!cell) throw new Error(`There is no entity &${id} in this area.`);
    return cell;
  }

  move(id: number, destination: Vector, destinationLayer?: LayerName): void {
    const targetCell = this.cellAt(destination);
    const sourceCell = this.find(id);

    if (!destinationLayer) {
      const layers = sourceCell.find(id);
      layers.forEach((layer) => { targetCell.put(layer, id); });
    } else {
      targetCell.put(destinationLayer, id);
    }

    sourceCell.remove(id);
  }

  put(position: Vector, entityId: number, layer: LayerName = 'middle'): void {
    const cell = this.cellAt(position);
    cell.put(layer, entityId);
  }
}
