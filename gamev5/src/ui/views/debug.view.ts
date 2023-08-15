import { Dictionary } from '../../scripting/dictionary';
import { Interpreter } from '../../scripting/interpreter';
import { Stack } from '../../scripting/stack';
import { Component } from '../component';
import { logger } from '../../shared/logger';
import { Vector } from '../../shared/vector';
import { TextInputComponent } from '../components/text_input_component';
import { TextOutputComponent } from '../components/text_output_component';
import { IRouter, View } from '../view';

export class DebugView extends View {
  private input: Component;

  private output: TextOutputComponent;

  constructor(router: IRouter) {
    super(router);

    this.input = this.registerComponent('input', new TextInputComponent(new Vector(0, 2)));
    this.output = this.registerComponent('output', new TextOutputComponent(new Vector(0, 2)));

    const dictionary = new Dictionary();
    const stack = new Stack();

    this.input.on('submit', (event): void => {
      const interpreter = new Interpreter(dictionary, event.text, stack);

      try {
        while (!interpreter.finished) {
          const action = interpreter.run();
          if (action) {
            this.print(`${action.name}`);
            logger.debug(action);
          }
        }
        this.print(`[${interpreter.print()}]`);
      } catch (err: unknown) {
        this.print(`${(err as Error).constructor.name}: ${(err as Error).message}`);
      }
    });

    this.focus(this.input);
  }

  private print(str: string): void {
    this.input.position.addY(1);
    this.output.push(str);
  }
}
