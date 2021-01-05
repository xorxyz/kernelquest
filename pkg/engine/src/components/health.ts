import * as joi from 'joi';
import { Component } from '../../lib/ecs';

export default class HealthComponent extends Component {
  type = 'health'
  schema = joi.object({
    hp: joi.number().min(0),
  })
}
