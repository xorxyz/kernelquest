import { IAction } from '../../shared/interfaces';
import { IProgram } from '../kernel/program';

export const login: IProgram = {
  * execute(): Generator<IAction | null, number, number> {
    yield null;
    return 0;
  },
};
