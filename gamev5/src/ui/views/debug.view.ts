import { Dictionary } from '../../scripting/dictionary';
import { Interpreter } from '../../scripting/interpreter';
import { Stack } from '../../scripting/stack';
import { CompilationError } from '../../shared/errors';
import { Vector } from '../../shared/vector';
import { TextInputComponent } from '../components/text_input_component';
import { TextOutputComponent } from '../components/text_output_component';
import { IRouter, View } from '../view';

export class DebugView extends View {
  constructor(router: IRouter) {
    super(router);

    const inputComponent = this.registerComponent('input', new TextInputComponent(new Vector(0, 2)));
    const outputComponent = this.registerComponent('output', new TextOutputComponent(new Vector(0, 2)));

    const dictionary = new Dictionary();
    const stack = new Stack();

    inputComponent.on('submit', (event): void => {
      try {
        // const compiler = new Compiler(dictionary, event.text);
        // const expression = compiler.compile();
        const interpreter = new Interpreter(dictionary, event.text, stack);
        interpreter.run();
        outputComponent.push(`c: ${interpreter.print()}`);
        inputComponent.position.addY(1);
      } catch (err: unknown) {
        outputComponent.push((err as CompilationError).message);
        inputComponent.position.addY(1);
      }
    });

    this.focus(inputComponent);
  }
}
