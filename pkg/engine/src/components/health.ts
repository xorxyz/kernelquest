import * as joi from 'joi';
import { Component } from '../../lib/ecs';

export default class HealthComponent extends Component {
  constructor () {
    super('health', { hp: Number })
  }
}
