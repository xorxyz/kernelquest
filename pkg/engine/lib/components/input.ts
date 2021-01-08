import { Component } from '../../lib/ecs';

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
