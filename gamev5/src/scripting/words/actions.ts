import { IAction } from '../../shared/interfaces';
import { Word } from '../dictionary';

export const noop: Word = (): null => null;

export const clear: Word = (): IAction => ({
  name: 'clear',
});
