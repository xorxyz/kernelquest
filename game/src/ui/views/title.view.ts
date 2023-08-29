import {
  SCREEN_HEIGHT, SCREEN_WIDTH,
} from '../../shared/constants';
import { msInTicks } from '../../shared/time';
import { Vector } from '../../shared/vector';
import { TextOutputComponent } from '../components/text_output_component';
import { IRouter, View } from '../view';

export class TitleView extends View {
  private startingTick = 0;

  private title: TextOutputComponent;

  constructor(router: IRouter) {
    super(router);

    const title = 'Kernel Quest';
    const xy = new Vector(SCREEN_WIDTH / 2 - (title.length / 2), SCREEN_HEIGHT / 2 - 1);

    this.title = this.registerComponent('title', new TextOutputComponent(xy, title));
  }

  override onLoad(tick: number): void {
    this.startingTick = tick;
  }

  override update(tick: number): null {
    if (tick > (this.startingTick + msInTicks(1000))) {
      this.router.go('debug');
    }

    return null;
  }
}
