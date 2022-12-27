import * as Inkjs from 'inkjs';
import data from '../assets/dialogue/hello-world.ink';

const story = new Inkjs.Compiler(data).Compile();

export {
  story,
};
