import { Component } from '../../src/ecs';

interface ISchema {
  userId: string,
  line: string
}

const schema: ISchema = {
  userId: '',
  line: '',
};

export default class CommandComponent extends Component {
  data: ISchema

  constructor(userId: string) {
    super('command', { ...schema, userId });
  }
}
