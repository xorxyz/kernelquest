export interface INode {
  key: string;
  value: unknown;
}

export interface IEdge {
  label: string;
  from: INode;
  to: INode;
}

export class Graphv2 {
  private nodes: Set<INode> = new Set();
  private edges: Set<IEdge> = new Set();
  private edgesByLabel: Map<string, Set<IEdge>> = new Map();

  addNode(key: string, value: unknown) {
    const node = {
      key,
      value,
    };
    this.nodes.add(node);
    return node;
  }

  addEdge(from: INode, to: INode, label: string) {
    const edge = {
      from,
      to,
      label,
    };
    this.edges.add(edge);
    if (!this.edgesByLabel.has(label)) {
      this.edgesByLabel.set(label, new Set());
    }
    this.edgesByLabel.get(label)?.add(edge);
    return edge;
  }

  findNodeByValue(value: unknown) {
    return [...this.nodes].find((n) => n.value === value);
  }
}

const g = new Graphv2();

const t1 = g.addNode('t1', { t: 1 });
const t2 = g.addNode('t2', { t: 2 });

g.addEdge(t2, t1, 'follows');
// follows, followed_by

const a = g.addNode('a', { x: 'a' });
const b = g.addNode('b', { x: 'b' });

g.addEdge(a, b, 'contains');
// contains, part_of

const x = g.addNode('x', {});
const y = g.addNode('y', {});

g.addEdge(x, y, 'close_to');
g.addEdge(y, x, 'close_to');
// close_to (<->)

const blue = g.addNode('blue', {});
const sky = g.addNode('sky', {});

g.addEdge(sky, blue, 'expresses');
// Identity information

/*

*/
