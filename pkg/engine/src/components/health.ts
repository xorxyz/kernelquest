import joi from 'joi';
import { Component, ComponentType } from '../../lib/ecs';

export const type: ComponentType = 'health';
export const schema: joi.ObjectSchema = joi.object({
  hp: joi.number().min(0),
})

export default class Health extends Component {
  constructor(data) {
    super(type, schema, data)
  }
}
