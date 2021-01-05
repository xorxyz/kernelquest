import joi from 'joi'
import { Component, ComponentType } from '../../lib/ecs';

export const type: ComponentType = 'graphic';
export const schema: joi.ObjectSchema = joi.object({
  emoji: joi.string()
});

export default class Graphic extends Component {
  constructor(data) {
    super(type, schema, data)
  }
}
