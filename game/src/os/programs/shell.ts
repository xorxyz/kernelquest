import { Runtime } from '../../scripting/runtime';
import { IAction } from '../../shared/interfaces';
import { Program } from '../kernel/program';
import { STDIN_FILENO, read } from '../libraries/stdlib';

type ShellProgramType = string | IAction | null

export class Shell extends Program<ShellProgramType, null> {
  private runtime = new Runtime();

  * run(): Generator<IAction | null, null> {
    const code = yield read(STDIN_FILENO);

    const execution = this.runtime.execute(code);

    while (!this.runtime.done) {
      const result = execution.next();
      if (result.value) {
        yield result.value;
      }
    }

    return null;
  }
}
