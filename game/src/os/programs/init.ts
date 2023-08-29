import { IAction } from '../../shared/interfaces';
import { IProgram } from '../kernel/program';

export const init: IProgram = {
  * run(): Generator<IAction | null, number, string> {
    yield null;
    return 0;
  },
};
