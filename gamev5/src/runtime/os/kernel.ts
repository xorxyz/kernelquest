import { VM } from './ps/vm';
import { FileSystem } from './fs/filesystem';
import { Group } from './iam/group';
import { User } from './iam/user';
import { ProcessTable } from './ps/process_table';
import { Process } from './ps/process';

export class Kernel {
  readonly shell: Process;

  private vm = new VM();

  private users = new Set<User>();

  private groups = new Set<Group>();

  private fileSystem = new FileSystem();

  private processTable = new ProcessTable();

  constructor() {
    this.shell = this.processTable.fork(0);
  }
}
