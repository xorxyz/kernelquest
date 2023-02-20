import * as Inkjs from 'inkjs';
import helloworld from '../../assets/dialogue/hello-world.ink';
import bookshelf from '../../assets/books/bookshelf.ink';

const files = [
  helloworld,
  bookshelf,
];

const story = new Inkjs.Compiler(files.join('\n')).Compile();

export {
  story,
};
