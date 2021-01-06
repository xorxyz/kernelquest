import * as joi from 'joi';
import { Component } from '../../lib/ecs';

export default class CommandComponent extends Component {
  constructor () {
    super('command', { type: String, payload: Object })
  }
}
