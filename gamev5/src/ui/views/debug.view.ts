import { Vector } from '../../shared/vector';
import { TextInputComponent } from '../components/text_input_component';
import { TextOutputComponent } from '../components/text_output_component';
import { IRouter, View } from '../view';

export class DebugView extends View {
  constructor(router: IRouter) {
    super(router);

    const inputComponent = this.registerComponent('input', new TextInputComponent(new Vector(0, 2)));
    const outputComponent = this.registerComponent('output', new TextOutputComponent(new Vector(0, 2)));

    inputComponent.on('submit', (event): void => {
      outputComponent.push(event.text);
      inputComponent.position.addY(1);
    });

    this.focus(inputComponent);
  }
}
