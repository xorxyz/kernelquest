import { FileSystem } from './filesystem';
import { Group } from './group';
import { Process } from './process';
import { ProcessManager } from './process_manager';
import { User } from './user';

export class Kernel {
  readonly shell: Process;

  private users = new Set<User>();

  private groups = new Set<Group>();

  private fileSystem = new FileSystem();

  private processManager = new ProcessManager();

  constructor() {
    this.shell = this.processManager.fork(0);
  }
}
