import { Vector } from '../../src/math';
import { Component } from '../../src/ecs';

interface ISchema {
  position: Vector,
  velocity: Vector
}

const schema: ISchema = { 
  position: new Vector(),
  velocity: new Vector()
}

export default class TransformComponent extends Component {
  data: ISchema

  constructor () {
    super('transform', schema)
  }
}
