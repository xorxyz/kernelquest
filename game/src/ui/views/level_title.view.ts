import { IKeyboardEvent } from '../../shared/interfaces';
import { msInTicks } from '../../shared/time';
import { isDev } from '../../shared/util';
import { Vector } from '../../shared/vector';
import { IGameState } from '../../state/valid_state';
import { EveryAction } from '../../world/actions';
import { TextLabelComponent } from '../components/text_label';
import { IRouter, View } from '../view';

export const MS_VISIBLE = isDev ? 1000 : 1500;

export class LevelTitleView extends View {
  private startingTick = 0;

  private title: TextLabelComponent;

  private init = false;

  constructor(router: IRouter) {
    super(router);
    const xy = new Vector(42, 11);

    this.title = this.registerComponent('title', new TextLabelComponent(xy, ''));

    this.focus(this.title);
  }

  override onLoad(tick: number): void {
    this.startingTick = tick;
  }

  override update(tick: number, shell, state: IGameState, keyboardEvents: IKeyboardEvent[]): EveryAction | null {
    this.title.update(`Level ${state.level.id}`);

    if (!this.init) {
      this.init = true;
      return { name: 'pause_music', args: {} };
    }

    if (tick > (this.startingTick + msInTicks(MS_VISIBLE))) {
      this.router.go('debug');
      this.init = false;
    }

    return null;
  }
}
