import * as joi from 'joi';
import { Component } from '../../lib/ecs';

export default class PositionComponent extends Component {
  type = 'position'
  schema = joi.object({
    x: joi.number().min(0),
    y: joi.number().min(0)
  })
}
