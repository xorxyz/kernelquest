import { Vector } from '../../shared/vector';
import { TextInputComponent } from '../components/text_input_component';
import { TextOutputComponent } from '../components/text_output_component';
import { IRouter, View } from '../view';
import { EveryAction } from '../../world/actions';
import { IKeyboardEvent } from '../../shared/interfaces';
import { KeyCodes } from '../keys';
import { TitleBarComponent } from '../components/title_bar';
import { StackBarComponent } from '../components/stack_bar';
import { IGameState } from '../../state/valid_state';
import { SCREEN_HEIGHT } from '../../shared/constants';
import { Runtime } from '../../scripting/runtime';

const OUTPUT_VERTICAL_OFFSET = 2;


const titleBar = 1;
const stackBar = 1;
const margin = 4;

const maxHeight = SCREEN_HEIGHT - titleBar - stackBar - margin;
export class DebugView extends View {
  private title: TitleBarComponent;

  private input: TextInputComponent;

  private stack: StackBarComponent;

  private output: TextOutputComponent;

  private historyIndex: number = 0;

  private history: string[] = []

  private init = false;

  constructor(router: IRouter) {
    super(router);

    this.title = this.registerComponent('title', new TitleBarComponent(new Vector(0, 0)));
    this.stack = this.registerComponent('stack', new StackBarComponent(new Vector(2, 1)));

    this.output = this.registerComponent('output', new TextOutputComponent(new Vector(2, OUTPUT_VERTICAL_OFFSET)));
    this.input = this.registerComponent('input', new TextInputComponent(new Vector(2, OUTPUT_VERTICAL_OFFSET)));

    this.input.on('up', this.up.bind(this));
    this.input.on('down', this.down.bind(this));
    this.input.on('submit', this.submit.bind(this));

    this.focus(this.input);
  }

  private submit(event): EveryAction {
    if (event.text === '') {
      return { name: 'next', args: {} }
    }
    
    this.historyIndex = this.history.length + 1;
    this.history.push(event.text);

    return {
      name: 'sh',
      args: {
        text: event.text,
      }
    }
  }

  private up (): EveryAction {
    if (this.historyIndex !== 0) {
      this.historyIndex = this.historyIndex - 1;
      this.input.replace(this.history[this.historyIndex]);
    }

    return { name: 'noop', args: {} };
  }

  private down (): EveryAction {
    if (this.historyIndex < this.history.length) {
      this.historyIndex = this.historyIndex + 1;
      this.input.replace(this.history[this.historyIndex]);
    }

    return { name: 'noop', args: {} };
  }

  override update(_: number, shell: Runtime, state: IGameState, keyboardEvents: IKeyboardEvent[]): EveryAction | null {
    const linesOfText = shell.getOutput().slice(-maxHeight);

    this.title.update(shell, state);
    this.output.update(linesOfText);
    this.input.update(shell, state, keyboardEvents);
    this.stack.update(shell, state);

    if (!this.init) {
      this.init = true;
      return { name: 'play_music', args: { title: 'village' } };
    }

    if (state.level.victory) {
      this.router.go('victory');
    } 

    this.input.position.setY(OUTPUT_VERTICAL_OFFSET + this.output.linesOfText.length);
    let action: EveryAction | null = null
    keyboardEvents.forEach(event => {
      switch (event.keyCode) {
        case KeyCodes.BACKQUOTE:
          action = { name: 'debug', args: {} };
          break;
        case KeyCodes.PERIOD:
          action = { name: 'next', args: {} };
          break;
        default:
          break;
      }
    })
    return action;
  }
}
