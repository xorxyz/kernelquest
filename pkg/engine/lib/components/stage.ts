import { ComponentType } from '.';
import { Component } from '../../src/ecs';

export default class StageComponent extends Component {
  constructor() {
    super(ComponentType.Stage, {
      actors: Array,
    });
  }
}
