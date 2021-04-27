import { Action } from '../engine/actions';
import { Keys } from '../engine/constants';

export function ctrl(str: string): Action | null {
  const action: Action | null = null;

  switch (str) {
    case (Keys.ENTER):
      action = new SwitchMode();
      break;
    // case (Keys.SHIFT_ARROW_UP):
    //   command = new Drag(0, -1);
    //   break;
    // case (Keys.SHIFT_ARROW_RIGHT):
    //   command = new Drag(1, 0);
    //   break;
    // case (Keys.SHIFT_ARROW_DOWN):
    //   command = new Drag(0, 1);
    //   break;
    // case (Keys.SHIFT_ARROW_LEFT):
    //   command = new Drag(-1, 0);
    //   break;
    // case (Keys.ARROW_UP):
    //   command = new Move(0, -1);
    //   break;
    // case (Keys.ARROW_RIGHT):
    //   command = new Move(1, 0);
    //   break;
    // case (Keys.ARROW_DOWN):
    //   command = new Move(0, 1);
    //   break;
    // case (Keys.ARROW_LEFT):
    //   command = new Move(-1, 0);
    //   break;
    // case (Keys.LOWER_D):
    //   command = new Drop(null);
    //   break;
    // case (Keys.LOWER_W):
    //   command = new Wield();
    //   break;
    // case (Keys.LOWER_I):
    //   command = new PrintInventory();
    //   break;
    // case (Keys.LOWER_P):
    //   command = new PickUp();
    //   break;
    // case (Keys.LOWER_R):
    //   command = new Rotate();
    //   break;
    default:
      break;
  }
  return command;
}
