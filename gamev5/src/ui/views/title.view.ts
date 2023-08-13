import {
  SCREEN_HEIGHT, SCREEN_WIDTH,
} from '../../shared/constants';
import { msInTicks } from '../../shared/time';
import { Vector } from '../../shared/vector';
import { TextOutputComponent } from '../components/text_output_component';
import { IRouter, View } from '../view';

export class TitleView extends View {
  private startingTick = 0;

  constructor(router: IRouter) {
    super(router);

    const title = 'Kernel Quest';

    const component = this.registerComponent('title', new TextOutputComponent(new Vector(SCREEN_WIDTH / 2 - (title.length / 2), SCREEN_HEIGHT / 2 - 1)));

    component.push(title);
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
