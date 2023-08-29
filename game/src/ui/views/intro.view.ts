import { MS_PER_GAME_CYCLE } from '../../shared/constants';
import { Vector } from '../../shared/vector';
import { IRouter, View } from '../view';
import { TextBoxComponent } from '../components/textbox';

const DELAY_MS_BEFORE_SKIP = 3000;
const TICKS_BEFORE_SKIP = DELAY_MS_BEFORE_SKIP / MS_PER_GAME_CYCLE;

export class IntroView extends View {
  skipAt = TICKS_BEFORE_SKIP;

  constructor(router: IRouter) {
    super(router);

    this.registerComponent('title', new TextBoxComponent(new Vector(0, 0), 'Kernel Quest'));
    this.registerEvent('key:enter', this.next.bind(this));
  }

  override onLoad(tick: number): void {
    this.skipAt = tick + TICKS_BEFORE_SKIP;
  }

  override update(tick: number): null {
    if (tick > this.skipAt) {
      this.next();
    }
    return null;
  }

  private next(): void {
    this.router.go('player_select');
  }
}
