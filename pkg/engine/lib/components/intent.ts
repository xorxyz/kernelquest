import { Component } from '../../src/ecs';

export enum IntentType {
  'NONE',
  'MOVE'
}

interface ISchema {
  intent: IntentType,
  args: Array<string>
}

const schema: ISchema = {
  intent: IntentType.NONE,
  args: [],
};

export default class IntentComponent extends Component {
  data: ISchema

  constructor() {
    super('intent', schema);
  }
}
