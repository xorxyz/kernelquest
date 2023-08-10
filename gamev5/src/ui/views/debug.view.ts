import { Vector } from '../../shared/vector';
import { TextInputComponent } from '../components/text_input_component';
import { IRouter, View } from '../view';

export class DebugView extends View {
  constructor(router: IRouter) {
    super(router);

    const inputComponent = this.registerComponent('input', new TextInputComponent(new Vector(0, 2)));

    this.focus(inputComponent);
  }
}
