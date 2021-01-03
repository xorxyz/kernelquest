import { Component } from '../core/classes';
import joi from 'joi';

export default class Command extends Component {
  constructor (data) {
    super(joi.object({
      type: joi.string(),
      payload: joi.object()
    }), data)
  }
}
