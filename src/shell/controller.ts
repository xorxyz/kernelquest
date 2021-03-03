import { Keys } from '../../lib/constants';
import { Command, Move, PickUp, SwitchMode } from '../engine/agents/commands';

export function ctrl(buf: Buffer): Command | null {
  let command: Command | null = null;

  switch (buf.toString('hex')) {
    case (Keys.ENTER):
      command = new SwitchMode();
      break;
    case (Keys.ARROW_UP):
      command = new Move(0, -1);
      break;
    case (Keys.ARROW_RIGHT):
      command = new Move(1, 0);
      break;
    case (Keys.ARROW_DOWN):
      command = new Move(0, 1);
      break;
    case (Keys.ARROW_LEFT):
      command = new Move(-1, 0);
      break;
    case (Keys.LOWER_P):
      command = new PickUp();
      break;
    default:
      break;
  }
  return command;
}
