export interface INode {
  value: any,
  edges: Array<INode>
}

export default class Graph {
  private nodes: Array<INode> = [];

  get values(): Array<INode> {
    return this.nodes.map((node) => node.value);
  }

  addNode(value: any): ThisType<Graph> {
    this.nodes.push({
      value,
      edges: [],
    });

    return this;
  }

  removeNode(value: any): ThisType<Graph> {
    const index = this.nodes.findIndex((node) => node.value === value);

    this.nodes.splice(index, 1);

    return this;
  }

  find(value: any): INode | undefined {
    return this.nodes.find((node) => node.value === value);
  }

  addLine(fromValue: any, toValue: any): ThisType<Graph> {
    const fromNode = this.find(fromValue);
    const toNode = this.find(toValue);

    if (!fromNode || !toNode) {
      throw new Error('Both nodes need to exist');
    }

    fromNode.edges.push(toNode);

    return this;
  }
}
