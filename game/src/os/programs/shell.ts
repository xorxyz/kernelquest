import { Runtime } from '../../scripting/runtime';
import { IAction } from '../../shared/interfaces';
import { IProgram } from '../kernel/program';
import { STDIN_FILENO, read } from '../libraries/stdlib';

export const shell: IProgram = {
  * run(runtime: Runtime): Generator<IAction | null, number, string> {
    const code: string = yield read(STDIN_FILENO);
    const exec = runtime.execute(code);

    for (let result = exec.next(); !result.done; result = exec.next()) {
      yield result.value;
    }

    return 0;
  },
};
