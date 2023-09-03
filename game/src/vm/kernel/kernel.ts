import { TTY } from '../devices/tty';
import { FileSystem } from './filesystem';
import { Group } from './group';
import { Process } from './process';
import { ProcessManager } from './process_manager';
import { User } from './user';

export class Kernel {
  readonly shell: Process;

  readonly tty = new TTY();

  private fileSystem = new FileSystem();

  private groups = new Set<Group>();

  private processManager = new ProcessManager();

  private users = new Set<User>();

  constructor() {
    this.shell = this.processManager.fork(0);
  }
}
