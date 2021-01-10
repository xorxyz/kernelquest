import { Component } from '../../src/ecs';

interface ISchema {
  userId: string,
  command: string
}

const schema: ISchema = {
  userId: '',
  command: ''
}

export default class CommandComponent extends Component {
  data: ISchema

  constructor (userId: string) {
    super('command', { ...schema, userId })
  }
}
