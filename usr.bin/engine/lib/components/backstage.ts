import { Component } from '../../src/ecs';

interface ISchema {
  actors: Array<string>,
  items: Array<string>,
  cells: Array<string>
}

const schema: ISchema = {
  actors: [],
  items: [],
  cells: [],
};

export default class BackstageComponent extends Component {
  data: ISchema

  constructor() {
    super('transform', schema);
  }
}
