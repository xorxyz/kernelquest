import { isAlphaNumeric } from '../../../shared/util';
import { Directory } from './directory';
import { File } from './file';
import { INode } from './inode';

function isValid(path: string): boolean {
  return path.startsWith('/') && isAlphaNumeric(path.slice(-1));
}

export class FileSystem {
  private counter = 1;

  private files = new Set<File>();

  private tree = new Directory(0, 0, 0);

  find(path: string): INode {
    if (!isValid(path)) throw new Error('Path is invalid.');
    const segments = path.split('/').reverse();

    let node = this.tree;
    let file: INode | null = null;

    while (segments.length > 0) {
      const name = segments.pop();
      if (name) {
        file = node.get(name);
        if (!file) break;
        if (file instanceof Directory) {
          node = file;
        }
      }
    }

    if (!file) throw new Error(`File not found: '${path}'.`);

    return file;
  }
}
