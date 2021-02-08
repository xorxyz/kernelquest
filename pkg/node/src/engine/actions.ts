/*
 * actors can take actions
 */

import { Vector } from '../lib/math';

export abstract class Action {
  name: string
}

export class MoveAction extends Action {
  name: 'move'
  direction: Vector
}

export class SayAction extends Action {
  name: 'say'
  message: string
}
