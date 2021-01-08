import { Component } from '../../src/ecs';

interface Input {
  line: string,
  domKey: string
}

export default class InputComponent extends Component {
  constructor () {
    super('input', { 
      buffer: [],
    })
  }
}
