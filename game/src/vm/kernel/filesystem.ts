import { isAlphaNumeric } from '../../shared/util';
import { Directory } from './directory';
import { File } from './file';
import { INode } from './inode';

function isValid(path: string): boolean {
  return path.startsWith('/') && isAlphaNumeric(path.slice(-1));
}

export class FileSystem {
  private counter = 0;

  private files = new Set<INode>();

  private tree: Directory;

  constructor() {
    this.tree = this.createDirectory('/');
    const bin = this.createDirectory('bin');
    const boot = this.createDirectory('boot');
    const dev = this.createDirectory('dev');
    const lib = this.createDirectory('lib');
    const sbin = this.createDirectory('sbin');

    this.tree.addChild(bin);
    dev.addChild(this.createFile('sh'));

    this.tree.addChild(boot);
    boot.addChild(this.createFile('bootloader'));
    boot.addChild(this.createFile('kernel'));

    this.tree.addChild(dev);
    dev.addChild(this.createFile('null'));
    dev.addChild(this.createFile('tty'));

    this.tree.addChild(lib);
    lib.addChild(this.createFile('libkqj.so.1'));

    this.tree.addChild(sbin);
    sbin.addChild(this.createFile('init'));
  }

  createFile(name: string, userId = 0, groupId = 0): File {
    const file = new File(this.incrementId(), name, userId, groupId);
    this.files.add(file);
    return file;
  }

  createDirectory(name: string, userId = 0, groupId = 0): Directory {
    const dir = new Directory(this.incrementId(), name, userId, groupId);
    this.files.add(dir);
    return dir;
  }

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

  incrementId(): number {
    const next = this.counter;
    this.counter += 1;
    return next;
  }
}
