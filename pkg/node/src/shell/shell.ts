import Engine from '../engine/engine';
import Interpreter from './interpreter';

export default class Shell {
  private engine: Engine
  private interpreter: Interpreter

  constructor(engine: Engine) {
    this.engine = engine;
    this.interpreter = new Interpreter();
  }

  handleLine(line: string): Array<string> {
    console.log('Shell: handleLine:', line);

    const output = this.interpreter.eval(line);

    return output;
  }
}
