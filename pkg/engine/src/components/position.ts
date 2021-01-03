import joi from 'joi';
import { Component } from '../core/classes';

export default class Position extends Component {
  constructor() {
    super(joi.object({
      x: joi.number().min(0),
      y: joi.number().min(0)
    }))
  }
}
