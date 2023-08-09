import { Vector } from '../../shared/vector';
import { IRouter, View } from '../view';
import { ClockComponent } from '../components/clock_component';

export class BlankView extends View {
  constructor(router: IRouter) {
    super(router);
    this.registerComponent('clock', new ClockComponent(new Vector(1, 1)));
  }
}
