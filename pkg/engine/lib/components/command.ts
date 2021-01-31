import { ComponentType } from '.';
import { Component } from '../../src/ecs';

interface ISchema {
  playerId: string,
  line: string,
  previousLine: string
}

const schema: ISchema = {
  playerId: '',
  line: '',
  previousLine: '',
};

export default class CommandComponent extends Component {
  data: ISchema

  constructor(playerId: string) {
    super(ComponentType.Command, { ...schema, playerId });
  }
}
