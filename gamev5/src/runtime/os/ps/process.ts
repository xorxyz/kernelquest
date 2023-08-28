import { VM } from './vm';

type ProcessState = 'New' | 'Ready' | 'Running' | 'Waiting' | 'Terminated'

type EventConditionCode = 'IO_COMPLETION' | 'TIMER_EXPIRE' | 'SYNC_PRIMITIVE' | 'CHILD_EXIT'

type Signal = 'SIGINT' | 'SIGTERM' // | 'SIGKILL' | 'SIGHUP' | 'SIGCHLD'

export class Process {
  readonly id: number;

  readonly parentId: number;

  readonly childrenIds = new Set<number>();

  private owner: { userId: number, groupId: number };

  private eventConditionCodes = new Set<EventConditionCode>();

  private signalInfo = new Set<Signal>();

  private state: ProcessState = 'New';

  private exitStatus = 0;

  private fileDescriptors = [];

  private code = '';

  private vm = new VM();

  constructor(parentId: number, id: number, userId: number, groupId: number) {
    this.parentId = parentId;
    this.id = id;
    this.owner = { userId, groupId };
  }

  clone(nextId: number): Process {
    const { userId, groupId } = this.owner;
    const process = new Process(this.id, nextId, userId, groupId);
    return process;
  }

  eval(text: string): void {
    this.vm.eval(text);
  }

  printStack(): string {
    return `[${this.vm.stack.print()}]`;
  }
}
