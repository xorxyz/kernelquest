import { IAction } from '../../shared/interfaces';
import { Meaning } from '../dictionary';

export const noop: Meaning = (): null => null;

export const clear: Meaning = (): IAction => ({
  name: 'clear',
});
