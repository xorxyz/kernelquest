import { IKeyboardEvent } from '../../shared/interfaces';
import { msInTicks } from '../../shared/time';
import { Vector } from '../../shared/vector';
import { EveryAction } from '../../world/actions';
import { TextLabelComponent } from '../components/text_label';
import { IRouter, View } from '../view';

export const MS_VISIBLE = 3000

export class LevelTitleView extends View {
  private startingTick = 0;

  private title: TextLabelComponent;

  private init = false;

  constructor(router: IRouter) {
    super(router);

    const text = 'Level 1';
    const xy = new Vector(42, 11);

    this.title = this.registerComponent('title', new TextLabelComponent(xy, text));

    this.focus(this.title);
  }

  override onLoad(tick: number): void {
    this.startingTick = tick;
  }

  override update(tick: number, shell, state, keyboardEvents: IKeyboardEvent[]): EveryAction | null {
    if (!this.init) {
      this.init = true;
      return { name: 'pause_music', args: {} };
    }

    if (tick > (this.startingTick + msInTicks(MS_VISIBLE))) {
      this.router.go('debug');
    }

    return null;
  }
}
