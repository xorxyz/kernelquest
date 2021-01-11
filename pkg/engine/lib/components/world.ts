import { Component } from '../../src/ecs';

interface ISchema {
  actors: Set<string>,
  positions: Map<string, string>
}

const schema: ISchema = {
  actors: new Set(),
  positions: new Map(),
};

export default class WorldComponent extends Component {
  data: ISchema

  constructor() {
    super('world', schema);
  }
}
