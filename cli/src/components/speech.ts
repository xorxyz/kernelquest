import { Cursor, esc, Style } from 'xor4-lib';
import { UiComponent } from '../component';

const dummyRoom: Array<Array<any>> = [];

/** @category Components */
export class Speech extends UiComponent {
  render() {
    return dummyRoom
      .map(([agent, message]) => [
        esc(Style.Invert),
        esc(Cursor.set(
          this.position.clone()
            .addX(agent.position.x * 2)
            .subX(Math.floor(message.text.length / 2))
            .addY(agent.position.y - 1),
        )),
        message.text,
      ].join(''));
  }
}
