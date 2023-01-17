import {
  debug, PriorityQueue, Vector, Direction, South,
} from '../shared';
import { Agent, Area, Cell } from '.';
import { Factor, LiteralVector } from '../interpreter';
import words from './words';

export class PathFinder {
  destination: Vector;

  constructor(x: number, y: number) {
    this.destination = new Vector(x, y);
  }

  heuristic(a: Cell, b: Cell) {
    return Math.abs(a.position.x - b.position.x) + Math.abs(a.position.y - b.position.y);
  }

  getKey(map: Map<Cell, Cell>, val: Cell) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const kv = [...map].find(([_, value]) => val === value);
    return kv ? kv[0] : null;
  }

  findPath(area: Area, from: Vector) {
    const start = area.cellAt(from);
    const end = area.cellAt(this.destination);

    if (!start || !end) {
      debug('no start or no end cell', start, end);
      return [];
    }

    const queue = new PriorityQueue<Cell>();
    const cameFrom: Map<Cell, Cell> = new Map();
    const costSoFar: Map<Cell, number> = new Map();
    const direction = new Direction(new South());
    const visited = new Set<Cell>();

    let reached = false;

    queue.put(start, 0);
    costSoFar.set(start, 0);

    while (!queue.isEmpty()) {
      const current = queue.get();
      const cost = costSoFar.get(current) || Infinity;

      if (current.position.equals(this.destination)) {
        reached = true;
        break;
      }

      const neighbours = area.getCellNeighbours(current, direction)
        .filter((x) => x && !visited.has(x));

      neighbours.forEach((candidate, i) => {
        if (!candidate || candidate.isBlocked) return;
        const oldCost = costSoFar.get(candidate) || Infinity;
        // eslint-disable-next-line prefer-const
        let newCost = cost + i;
        const thatDirection = candidate.position.clone().sub(current.position);
        // if neighbour's neighbour cant reach current, cost++
        const next = area.cellAt(candidate.position.clone().add(thatDirection));
        if (!next || next.isBlocked) {
          newCost++;
        }

        if (!costSoFar.has(candidate) || newCost < oldCost) {
          costSoFar.set(candidate, newCost);
          const priority = newCost + this.heuristic(candidate, end);
          queue.put(candidate, priority);
          cameFrom.set(candidate, current);
          visited.add(candidate);
        }
      });
    }

    return this.reconstructPath(cameFrom, start, end, reached);
  }

  reconstructPath(cameFrom: Map<Cell, Cell>, start: Cell, end: Cell, reached: boolean) {
    debug('reconstructPath()');
    if (!reached) return [];

    const cells: Array<Cell> = [];

    let next: Cell | undefined = end;

    while (next && next !== start) {
      cells.push(next);
      next = cameFrom.get(next);
      if (cells.length > 30) {
        debug('cells', cells.map((c) => c.position.label));
        debug('start', start);
        debug('end:', end);
        debug('cameFrom', cameFrom);
        debug('reached', reached);
        break;
      }
    }

    cells.push(start);

    return cells;
  }

  buildPathActions(agent: Agent, path: Array<Cell>): Array<Factor> {
    debug('buildPathActions()');
    const actions: Array<Factor> = [];
    const previousDirection = agent.facing.direction.value.clone();

    path.reduce((current, next) => {
      const direction = next.position.clone().sub(current.position);

      if (!direction.equals(previousDirection)) {
        actions.push(...[
          new LiteralVector(direction),
          words.face,
        ]);
      }

      previousDirection.copy(direction);
      actions.push(words.step);

      return next;
    });

    return actions;
  }
}
