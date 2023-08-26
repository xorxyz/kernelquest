import { VM } from '../../scripting/vm';
import { FileSystem } from './fs/filesystem';
import { Group } from './iam/group';
import { User } from './iam/user';
import { ProcessTable } from './ps/process_table';

export class Kernel {
  private users = new Set<User>();

  private groups = new Set<Group>();

  private fileSystem = new FileSystem();

  private processTable = new ProcessTable();

  private vm = new VM();
}
