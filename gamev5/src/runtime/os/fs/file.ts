// 0: --- No permissions
// 1: --x Execute only
// 2: -w- Write only
// 3: -wx Write and execute
// 4: r-- Read only
// 5: r-x Read and execute
// 6: rw- Read and write
// 7: rwx Read, write, and execute

import { INode } from './inode';

export class File extends INode {
  private content = '';

  read(): string {
    return this.content;
  }

  write(text: string): void {
    this.content = text;
  }
}
