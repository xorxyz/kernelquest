import {
  SCREEN_HEIGHT, SCREEN_WIDTH,
} from '../../shared/constants';
import { IKeyboardEvent } from '../../shared/interfaces';
import { msInTicks } from '../../shared/time';
import { isDev } from '../../shared/util';
import { Vector } from '../../shared/vector';
import { EveryAction } from '../../world/actions';
import { TextLabelComponent } from '../components/text_label';
import { KeyCodes } from '../keys';
import { IRouter, View } from '../view';

export const MS_VISIBLE = isDev ? 750 : 88000

export class TitleView extends View {
  private startingTick = 0;

  private title: TextLabelComponent;

  private init = false;

  constructor(router: IRouter) {
    super(router);

    const title = 'Kernel Quest';
    const xy = new Vector(SCREEN_WIDTH / 2 - (title.length / 2), (SCREEN_HEIGHT / 2) - 3);

    this.title = this.registerComponent('title', new TextLabelComponent(xy, title));

    this.registerComponent('instruction', new TextLabelComponent(xy.clone().addY(4).subX(5), 'Press enter to continue.'));

    this.focus(this.title);
  }

  override onLoad(tick: number): void {
    this.startingTick = tick;
  }

  override update(tick: number, shell, state, keyboardEvents: IKeyboardEvent[]): EveryAction | null {
    if (!this.init) {
      this.init = true;
      return { name: 'play_music', args: { title: 'title_screen' } };
    }

    if (tick > (this.startingTick + msInTicks(MS_VISIBLE)) || keyboardEvents.some(e => e.keyCode === KeyCodes.ENTER)) {
      keyboardEvents = [];
      this.router.go('level_title');
    }

    return null;
  }
}
