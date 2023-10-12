import { IKeyboardEvent } from '../../shared/interfaces';
import { msInTicks } from '../../shared/time';
import { Vector } from '../../shared/vector';
import { IGameState } from '../../state/valid_state';
import { EveryAction } from '../../world/actions';
import { TextLabelComponent } from '../components/text_label';
import { KeyCodes } from '../keys';
import { IRouter, View } from '../view';

export const MS_HEARD = 3000;

export class VictoryView extends View {
  private startingTick = 0;

  private title: TextLabelComponent;

  private init = false;

  private musicFinished = false;

  private done = false;

  constructor(router: IRouter) {
    super(router);

    const text = 'You solved the challenge!';
    const xy = new Vector(32, 11);

    this.title = this.registerComponent('title', new TextLabelComponent(xy, text));

    this.focus(this.title);
  }
  override onLoad(tick: number): void {
    this.startingTick = tick;
  }


  override update(tick: number, shell, state: IGameState, keyboardEvents: IKeyboardEvent[]): EveryAction | null {
    if (!this.init) {
      this.init = true;
      return { name: 'play_music', args: { title: 'victory' } };
    }

    if (this.done) {
      this.router.go('level_title');
      return null;
    }

    if (keyboardEvents.some(e => e.keyCode === KeyCodes.ENTER)) {
      this.done = true;
      return { name: 'load_level', args: { id: state.level.id + 1 } };
    }

    if (!this.musicFinished && tick > (this.startingTick + msInTicks(MS_HEARD))) {
      this.musicFinished = true;
      return { name: 'pause_music', args: {} };
    }

    return null;
  }
}
