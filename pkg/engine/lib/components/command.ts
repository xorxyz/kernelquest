import { Component } from '../../src/ecs';

export default class CommandComponent extends Component {
  constructor () {
    super('health', { 
      cmd: '',
      args: []
    })
  }
}
