import { Process } from './process';

export class ProcessTable {
  private counter = 1;

  private processes = new Map<number, Process>();

  constructor() {
    this.processes.set(0, new Process(0, 0, 0, 0));
  }

  fork(id: number): number {
    const process = this.processes.get(id);
    if (!process) throw new Error(`Process with id '${id}' does not exist.`);

    const nextId = this.incrementId();
    const clone = process.clone(nextId);

    this.processes.set(nextId, clone);

    return clone.id;
  }

  incrementId(): number {
    const id = this.counter;
    this.counter += 1;
    return id;
  }
}
