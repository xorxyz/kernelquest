import { MS_PER_GAME_CYCLE } from '../../shared/constants';
import { Vector } from '../../shared/vector';
import { View } from '../../shared/view';
import { TextBoxComponent } from '../components/textbox';

const DELAY_MS_BEFORE_SKIP = 3000;
const TICKS_BEFORE_SKIP = DELAY_MS_BEFORE_SKIP / MS_PER_GAME_CYCLE;

export class IntroView extends View {
  components = {
    title: new TextBoxComponent(new Vector(0, 0), 'Kernel Quest'),
  };

  events = {
    enter: this.next,
  };

  skipAt = TICKS_BEFORE_SKIP;

  private next(): void {
    this.router.go('player_select');
  }

  override onLoad(tick: number): void {
    this.skipAt = tick + TICKS_BEFORE_SKIP;
  }

  override update(tick: number): void {
    if (tick > this.skipAt) {
      this.next();
    }
  }
}
