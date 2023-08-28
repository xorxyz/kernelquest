import { Dictionary } from '../../scripting/dictionary';
import { Interpreter } from '../../scripting/interpreter';
import { Stack } from '../../scripting/stack';
import { Component } from '../component';
import { logger } from '../../shared/logger';
import { Vector } from '../../shared/vector';
import { TextInputComponent } from '../components/text_input_component';
import { TextOutputComponent } from '../components/text_output_component';
import { IRouter, View } from '../view';
import { IAction } from '../../shared/interfaces';

export class DebugView extends View {
  private input: Component;

  private output: TextOutputComponent;

  constructor(router: IRouter) {
    super(router);

    this.input = this.registerComponent('input', new TextInputComponent(new Vector(0, 2)));
    this.output = this.registerComponent('output', new TextOutputComponent(new Vector(0, 2)));

    this.input.on('submit', (event): IAction => ({
      name: 'sh',
      args: {
        text: event.text,
      },
    }));

    this.focus(this.input);
  }

  override update(): EveryAction | null {
    this.input.position.setY(2 + this.output.linesOfText.length);
    return null;
  }
}
