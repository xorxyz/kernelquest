import {
  SCREEN_HEIGHT, SCREEN_WIDTH,
} from '../../shared/constants';
import { msInTicks } from '../../shared/time';
import { Vector } from '../../shared/vector';
import { TextLabelComponent } from '../components/text_label';
import { IRouter, View } from '../view';

export const MS_VISIBLE = 2000

export class TitleView extends View {
  private startingTick = 0;

  private title: TextLabelComponent;

  constructor(router: IRouter) {
    super(router);

    const title = 'Kernel Quest';
    const xy = new Vector(SCREEN_WIDTH / 2 - (title.length / 2), (SCREEN_HEIGHT / 2) - 2);

    this.title = this.registerComponent('title', new TextLabelComponent(xy, title));

    this.focus(this.title);
  }

  override onLoad(tick: number): void {
    this.startingTick = tick;
  }

  override update(tick: number): null {
    if (tick > (this.startingTick + msInTicks(MS_VISIBLE))) {
      this.router.go('debug');
    }

    return null;
  }
}
