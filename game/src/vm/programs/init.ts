import { IAction } from '../../shared/interfaces';
import { IProgram } from '../kernel/program';

export const init: IProgram = {
  * execute(): Generator<IAction | null, number, number> {
    yield null;
    return 0;
  },
};
