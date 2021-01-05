import joi from 'joi';
import { Component, ComponentType } from '../../lib/ecs';

export const type: ComponentType = 'position';
export const schema: joi.ObjectSchema = joi.object({
  x: joi.number().min(0),
  y: joi.number().min(0)
})

export default class Position extends Component {
  constructor(data) {
    super(type, schema, data)
  }
}
