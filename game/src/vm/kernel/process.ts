import { Runtime } from '../../scripting/runtime';
import { IAction, SerializableType } from '../../shared/interfaces';
import { logger } from '../../shared/logger';
import { init } from '../programs/init';
import { IProgram } from './program';

type ProcessState = 'New' | 'Ready' | 'Running' | 'Waiting' | 'Terminated'

type EventConditionCode = 'IO_COMPLETION' | 'TIMER_EXPIRE' | 'SYNC_PRIMITIVE' | 'CHILD_EXIT'

type Signal = 'SIGINT' | 'SIGTERM' // | 'SIGKILL' | 'SIGHUP' | 'SIGCHLD'

export class Process {
  readonly id: number;

  readonly parentId: number;

  readonly childrenIds = new Set<number>();

  readonly args: SerializableType[];

  readonly program: IProgram;

  private owner: { userId: number, groupId: number };

  private eventConditionCodes = new Set<EventConditionCode>();

  private signalInfo = new Set<Signal>();

  private state: ProcessState = 'New';

  private exitStatus = 0;

  private fileDescriptors = [];

  private runtime = new Runtime();

  constructor(parent: Process | null, id: number) {
    if (parent === null) {
      this.parentId = 0;
      this.id = id;
      this.owner = { userId: 0, groupId: 0 };
      this.program = init;
      this.args = [];
      return;
    }

    this.parentId = parent.id;
    this.id = id;
    this.owner = { userId: parent.owner.userId, groupId: parent.owner.groupId };
    this.program = parent.program;
    this.args = parent.args;
  }

  run(): IAction | null {
    this.state = 'Running';
    const execution = this.program.run(this.runtime);

    const result = execution.next();

    logger.debug(result.value);
    this.state = 'Ready';

    return null;
  }
}
