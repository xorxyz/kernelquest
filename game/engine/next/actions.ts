import { Vector } from '../../lib/math';

export abstract class ActionResult {}
export class ActionSuccess extends ActionResult {}
export class ActionFailure extends ActionResult {}

export abstract class Action {
  abstract perform(): ActionResult
}
export class NoAction {
  perform() {
    return new ActionSuccess();
  }
}

export class MoveAction {
  direction: Vector
  perform() {
    return new ActionSuccess();
  }
}
