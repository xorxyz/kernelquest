import { Process } from './process';

export class ProcessManager {
  private counter = 0;

  private processes = new Map<number, Process>();

  constructor() {
    this.processes.set(0, new Process(null, this.incrementId()));
  }

  find(id: number): Process {
    const process = this.processes.get(id);
    if (!process) throw new Error(`There is no process with id ${id}.`);
    return process;
  }

  fork(id: number): Process {
    const parent = this.processes.get(id);
    if (!parent) throw new Error(`Process with id '${id}' does not exist.`);

    const nextId = this.incrementId();
    const child = new Process(parent, nextId);

    this.processes.set(nextId, child);

    return child;
  }

  incrementId(): number {
    const id = this.counter;
    this.counter += 1;
    return id;
  }
}
