import * as Inkjs from 'inkjs';
import test from '../../data/test.ink';

const files = [
  test,
];

export const story = new Inkjs.Compiler(files.join('\n')).Compile();
