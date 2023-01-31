export interface INode<T> {
  value: T,
  edges: Array<INode<T>>
}

export default class Graph<T> {
  private nodes: Array<INode<T>> = [];

  get values(): Array<T> {
    return this.nodes.map((node) => node.value);
  }

  addNode(value: T): ThisType<Graph<T>> {
    this.nodes.push({
      value,
      edges: [],
    });

    return this;
  }

  removeNode(value: T): ThisType<Graph<T>> {
    const index = this.nodes.findIndex((node) => node.value === value);

    this.nodes.splice(index, 1);

    return this;
  }

  find(value: T): INode<T> | undefined {
    return this.nodes.find((node) => node.value === value);
  }

  addLine(fromValue: T, toValue: T): ThisType<Graph<T>> {
    const fromNode = this.find(fromValue);
    const toNode = this.find(toValue);

    if (!fromNode || !toNode) {
      throw new Error('Both nodes need to exist');
    }

    fromNode.edges.push(toNode);
    toNode.edges.push(fromNode);

    return this;
  }
}
