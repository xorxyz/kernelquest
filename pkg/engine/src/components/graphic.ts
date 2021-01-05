import * as joi from 'joi'
import { Component } from '../../lib/ecs';

export default class GraphicComponent extends Component {
  type = 'graphic'
  schema = joi.object({
    emoji: joi.string()
  });
}
