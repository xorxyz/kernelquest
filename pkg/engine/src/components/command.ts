import * as joi from 'joi';
import { Component } from '../../lib/ecs';

export default class CommandComponent extends Component {
  type = 'command'
  schema = joi.object({
    type: joi.string(),
    payload: joi.object()
  });
}
