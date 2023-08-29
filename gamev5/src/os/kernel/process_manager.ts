import { Process } from './process';

export class ProcessManager {
  private counter = 0;

  private processes = new Map<number, Process>();

  constructor() {
    this.processes.set(0, new Process(0, this.incrementId(), 0, 0));
  }

  find(id: number): Process {
    const process = this.processes.get(id);
    if (!process) throw new Error(`There is no process with id ${id}.`);
    return process;
  }

  fork(id: number): Process {
    const process = this.processes.get(id);
    if (!process) throw new Error(`Process with id '${id}' does not exist.`);

    const nextId = this.incrementId();
    const clone = process.clone(nextId);

    this.processes.set(nextId, clone);

    return clone;
  }

  incrementId(): number {
    const id = this.counter;
    this.counter += 1;
    return id;
  }
}
