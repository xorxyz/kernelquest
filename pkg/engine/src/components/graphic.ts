import joi from 'joi'
import { Component } from '../core/classes';

export default class Graphic extends Component {
  constructor () {
    super(joi.object({
      emoji: joi.string()
    }))
  }
}
